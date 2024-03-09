import { Injectable } from '@nestjs/common'
import { FriendRequest, User } from '@prisma/client'
import prisma from '../../prisma/client'
import {
	AddFriendErrorMessages,
	FriendRequestsWithUsers,
	GetFriendsRequestsErrorMessages,
	SendRequestErrorMessages,
} from '../types/friends'
import { UserShowableData } from '../types/userShowableData'
import { ErrorMessage, SuccessMessage } from '../types/Messages'

type GetFriendRequestsResponse =
	| SuccessMessage<'Successfully got friend requests', { friendRequestsWithUsers: FriendRequestsWithUsers[] }>
	| ErrorMessage<GetFriendsRequestsErrorMessages>

type SendFriendRequestResponse = SuccessMessage<'Friend request send', void> | ErrorMessage<SendRequestErrorMessages>

type AddFriendsResponse = AddFriendErrorMessages | SuccessMessage<'Successfully added friend', void>

@Injectable()
export class FriendsRequestService {
	async getFriendRequests(id: number): Promise<GetFriendRequestsResponse> {
		try {
			const user: User = await prisma.user.findFirst({
				where: {
					id,
				},
			})
			if (!user) {
				return {
					success: false,
					message: 'Unauthorized',
				}
			}
			const outGoingFriendsRequests: FriendRequest[] = await prisma.friendRequest.findMany({
				where: {
					fromId: id,
				},
			})

			const incomingFriendsRequests: FriendRequest[] = await prisma.friendRequest.findMany({
				where: {
					toId: id,
				},
			})

			let friendRequestsWithUsers: FriendRequestsWithUsers[] = []

			for (let i = 0; i < outGoingFriendsRequests.length; i++) {
				const fromUser: UserShowableData = await prisma.user.findFirst({
					where: {
						id: outGoingFriendsRequests[i].fromId,
					},
					select: {
						id: true,
						username: true,
						displayName: true,
						birthdayDay: true,
						birthdayMonth: true,
						birthdayYear: true,
						userImage: true,
						color: true,
						textStatus: true,
						onlineStatus: true,
						createdAt: true,
					},
				})

				const toUser: UserShowableData = await prisma.user.findFirst({
					where: {
						id: outGoingFriendsRequests[i].toId,
					},
					select: {
						id: true,
						username: true,
						displayName: true,
						birthdayDay: true,
						birthdayMonth: true,
						birthdayYear: true,
						userImage: true,
						color: true,
						textStatus: true,
						onlineStatus: true,
						createdAt: true,
					},
				})

				let obj: FriendRequestsWithUsers = {
					friendRequest: outGoingFriendsRequests[i],
					fromUser,
					toUser,
				}

				friendRequestsWithUsers.push(obj)
			}

			for (let i = 0; i < incomingFriendsRequests.length; i++) {
				const fromUser: UserShowableData = await prisma.user.findFirst({
					where: {
						id: incomingFriendsRequests[i].fromId,
					},
					select: {
						id: true,
						username: true,
						displayName: true,
						birthdayDay: true,
						birthdayMonth: true,
						birthdayYear: true,
						userImage: true,
						color: true,
						textStatus: true,
						onlineStatus: true,
						createdAt: true,
					},
				})

				const toUser: UserShowableData = await prisma.user.findFirst({
					where: {
						id: incomingFriendsRequests[i].toId,
					},
					select: {
						id: true,
						username: true,
						displayName: true,
						birthdayDay: true,
						birthdayMonth: true,
						birthdayYear: true,
						userImage: true,
						color: true,
						textStatus: true,
						onlineStatus: true,
						createdAt: true,
					},
				})

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

	async acceptRequest(id: number, { requestId }: { requestId: number }) {
		try {
			const user: User = await prisma.user.findFirst({
				where: {
					id,
				},
			})
			if (!user) {
				return {
					success: false,
					message: 'Unauthorized',
				}
			}
			const acceptedRequest = await prisma.friendRequest.delete({
				where: {
					id: requestId,
				},
			})
			return await this.addFriend(id, { friendId: acceptedRequest.fromId })
		} catch (e) {
			console.log(e)
			return {
				success: false,
				message: 'Server error',
			}
		}
	}

	async sendRequest(id: number, { username }: { username: string }): Promise<SendFriendRequestResponse> {
		try {
			const user: User & { friends: User[] } = await prisma.user.findFirst({
				where: {
					id,
				},
				include: {
					friends: true,
				},
			})
			if (!user) {
				return {
					success: false,
					message: 'Unauthorized',
				}
			}
			const friends = user.friends
			const alreadyExisting = friends.find(friend => friend.username === username)
			if (alreadyExisting) {
				return {
					success: false,
					message: "You're already friends with that user",
				}
			}
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
			const friendRequest: FriendRequest = await prisma.friendRequest.create({
				data: {
					fromId: id,
					toId: friend.id,
					status: 'pending',
				},
			})
			if (friendRequest) {
				return {
					success: true,
					message: 'Friend request send',
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

	async addFriend(id: number, { friendId }: { friendId: number }): Promise<AddFriendsResponse> {
		if (id === friendId) {
			return {
				success: false,
				message: 'User cant add himself to friends',
			}
		}
		try {
			const user: User & { friends: User[] } = await prisma.user.findFirst({
				where: {
					id,
				},
				include: {
					friends: true,
				},
			})
			if (!user) {
				return {
					success: false,
					message: 'Unauthorized',
				}
			}

			// Проверяем, что пользователь, которого мы пытаемся добавить, существует
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

			// Проверяем, что пользователь не в списке друзей
			if (!user.friends.find((friend: User) => friend.id === friendId)) {
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
					},
				})
				const updatedFriendUser = await prisma.user.update({
					where: {
						id: friendId,
					},
					data: {
						friends: {
							connect: {
								id,
							},
						},
					},
				})
				if (updatedUser && updatedFriendUser) {
					return {
						success: true,
						message: 'Successfully added friend',
					}
				}
			}
			return {
				success: false,
				message: 'User already your friend',
			}
		} catch (e) {
			console.log(e)
			return {
				success: false,
				message: 'Server error',
			}
		}
	}
}
