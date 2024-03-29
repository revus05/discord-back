import { Injectable } from '@nestjs/common'
import { Chat, FriendRequest, User } from '@prisma/client'
import prisma from '../../../prisma/client'
import getUserWithJwt from '../../getUsers/getUserWithJwt'
import getUserShowableDataById from '../../getUsers/getUserShowableDataById'
import getUserShowableData from '../../utils/getUserShowableData'
import { UserIncludes, UserWithoutPassword } from '../../types/users'
import {
	AddFriendRequestResponse,
	DeleteFriendRequestResponse,
	FriendRequestsWithUsers,
	GetFriendRequestsResponse,
	SendFriendRequestResponse,
} from '../../types/friendRequests'
import { AcceptFriendRequestRequestBody, SendFriendRequestRequestBody } from '../../types/friends'

@Injectable()
export class FriendsRequestService {
	async getFriendRequests(jwt: string): Promise<GetFriendRequestsResponse> {
		try {
			// checking if the user exists
			const response = await getUserWithJwt(jwt)
			if (!response.success) {
				return {
					success: false,
					message: 'Unauthorized',
				}
			}
			const user: UserWithoutPassword = response.payload.user
			const id = user.id

			// getting friend requests from user
			const outGoingFriendsRequests: FriendRequest[] = await prisma.friendRequest.findMany({
				where: {
					fromId: id,
				},
			})

			// getting friend requests to user
			const incomingFriendsRequests: FriendRequest[] = await prisma.friendRequest.findMany({
				where: {
					toId: id,
				},
			})

			//
			let friendRequestsWithUsers: FriendRequestsWithUsers[] = []
			for (let i = 0; i < outGoingFriendsRequests.length; i++) {
				const fromUser = getUserShowableData(user)

				const toUser = await getUserShowableDataById(outGoingFriendsRequests[i].toId)

				let obj: FriendRequestsWithUsers = {
					friendRequest: outGoingFriendsRequests[i],
					fromUser,
					toUser,
				}

				friendRequestsWithUsers.push(obj)
			}

			for (let i = 0; i < incomingFriendsRequests.length; i++) {
				const fromUser = await getUserShowableDataById(incomingFriendsRequests[i].fromId)

				const toUser = getUserShowableData(user)

				let obj: FriendRequestsWithUsers = {
					friendRequest: incomingFriendsRequests[i],
					fromUser,
					toUser,
				}

				friendRequestsWithUsers.push(obj)
			}

			return {
				success: true,
				message: 'Successfully got friend requests',
				payload: {
					friendRequestsWithUsers,
				},
			}
		} catch (e) {
			console.log(e)
			return {
				success: false,
				message: 'Server error',
			}
		}
	}

	async acceptRequest(jwt: string, { requestId }: AcceptFriendRequestRequestBody): Promise<AddFriendRequestResponse> {
		try {
			// checking if the user exists
			const response = await getUserWithJwt(jwt, { friends: true })
			if (!response.success) {
				return {
					success: false,
					message: 'Unauthorized',
				}
			}
			const user: UserWithoutPassword & UserIncludes = response.payload.user
			const id = user.id

			// delete friend request
			const acceptedRequest: FriendRequest = await prisma.friendRequest.delete({
				where: {
					id: requestId,
				},
			})

			// adding friend to friends
			return await this.addFriend(id, user, { friendId: acceptedRequest.fromId })
		} catch (e) {
			console.log(e)
			return {
				success: false,
				message: 'Server error',
			}
		}
	}

	private async addFriend(
		id: number,
		user: UserWithoutPassword & UserIncludes,
		{ friendId }: { friendId: number },
	): Promise<AddFriendRequestResponse> {
		// checking if the friend is user
		if (id === friendId) {
			return {
				success: false,
				message: 'User cant add himself to friends',
			}
		}
		try {
			// checking if the friend exists
			const friendUser: User = await prisma.user.findFirst({
				where: {
					id: friendId,
				},
			})
			if (!friendUser) {
				return {
					success: false,
					message: 'Friend user not found',
				}
			}

			// checking that user is not in friend's friend list and vice versa
			if (user.friends.find((friend: User) => friend.id === friendId)) {
				return {
					success: false,
					message: 'User already your friend',
				}
			}

			// creating chat for this users
			const chat: Chat = await prisma.chat.create({
				data: {},
			})

			// updating users
			const updatedUser: User = await prisma.user.update({
				where: {
					id,
				},
				data: {
					friends: {
						connect: {
							id: friendId,
						},
					},
					chat: {
						connect: {
							id: chat.id,
						},
					},
				},
			})
			const updatedFriend: User & { chat: (Chat & { participants: User[] })[] } = await prisma.user.update({
				where: {
					id: friendId,
				},
				data: {
					friends: {
						connect: {
							id,
						},
					},
					chat: {
						connect: {
							id: chat.id,
						},
					},
				},
				include: {
					chat: {
						include: {
							participants: true,
						},
					},
				},
			})
			const { password, ...updatedFriendWithoutPassword } = updatedFriend
			// getting chatId
			const friend: UserWithoutPassword & { chatId: number } = {
				...updatedFriendWithoutPassword,
				chatId: updatedFriend.chat.find((chat: Chat & { participants: User[] }) =>
					chat.participants.find((participant: User) => participant.id === id),
				).id,
			}
			if (updatedUser && updatedFriend) {
				return {
					success: true,
					message: 'Successfully added friend',
					payload: {
						friend,
					},
				}
			}
		} catch (e) {
			console.log(e)
			return {
				success: false,
				message: 'Server error',
			}
		}
	}

	async sendRequest(jwt: string, { username }: SendFriendRequestRequestBody): Promise<SendFriendRequestResponse> {
		try {
			// checking if user exists and getting him
			const response = await getUserWithJwt(jwt, { friends: true })
			if (!response.success) {
				return {
					success: false,
					message: 'Unauthorized',
				}
			}
			const user = response.payload.user
			const friends = user.friends

			// checking if friend already in user friends
			const alreadyExisting = friends.find(friend => friend.username === username)
			if (alreadyExisting) {
				return {
					success: false,
					message: "You're already friends with that user",
				}
			}

			// checking if the user with provided username exists
			const friend: User = await prisma.user.findFirst({
				where: {
					username: username,
				},
			})
			if (!friend) {
				return {
					success: false,
					message: 'Incorrect username',
				}
			}

			if (friend.id === user.id) {
				return {
					success: false,
					message: "You can't yourself to friends",
				}
			}

			// checking if the request already exists
			const alreadyExistingRequest: FriendRequest = await prisma.friendRequest.findFirst({
				where: {
					OR: [
						{
							fromId: user.id,
							toId: friend.id,
						},
						{
							fromId: friend.id,
							toId: user.id,
						},
					],
				},
			})
			if (alreadyExistingRequest) {
				return {
					success: false,
					message: 'Request already sent to this user',
				}
			}

			// creating friend request
			const friendRequest: FriendRequest = await prisma.friendRequest.create({
				data: {
					fromId: user.id,
					toId: friend.id,
					status: 'pending',
				},
			})
			if (friendRequest) {
				return {
					success: true,
					message: 'Friend request send',
					payload: { friend: getUserShowableData(friend) },
				}
			}
			return {
				success: false,
				message: 'Server error',
			}
		} catch (e) {
			console.log(e)
			return {
				success: false,
				message: 'Server error',
			}
		}
	}

	async deleteRequest(jwt: string, requestId: number): Promise<DeleteFriendRequestResponse> {
		// getting user
		const response = await getUserWithJwt(jwt, { receivedRequests: true, sentRequests: true })
		if (!response.success) {
			return {
				success: false,
				message: 'Unauthorized',
			}
		}
		// getting sent and received requests
		const receivedRequests: FriendRequest[] = response.payload.user.receivedRequests
		const sentRequests: FriendRequest[] = response.payload.user.sentRequests

		// searching if user provided correct request
		let isFoundFlag = false
		receivedRequests.forEach((recReq: FriendRequest) => {
			if (recReq.id === requestId) {
				isFoundFlag = true
			}
		})
		if (!isFoundFlag) {
			sentRequests.forEach((sndReq: FriendRequest) => {
				if (sndReq.id === requestId) {
					isFoundFlag = true
				}
			})
		}

		if (!isFoundFlag) {
			return {
				success: false,
				message: 'Wrong request id provided',
			}
		}

		// deleting request
		const deletedRequest: FriendRequest = await prisma.friendRequest.delete({
			where: {
				id: requestId,
			},
		})

		if (!deletedRequest) {
			return {
				success: false,
				message: 'Server error',
			}
		}

		return {
			success: true,
			message: 'Request deleted successfully',
			payload: { deletedRequest },
		}
	}
}
