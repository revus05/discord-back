import { Injectable } from '@nestjs/common'
import prisma from '../../prisma/client'
import { FriendRequest, User } from '@prisma/client'
import { ErrorMessage, SuccessMessage } from '../types/Messages'
import {
	AddFriendErrorMessages,
	FriendRequestsWithUsers,
	GetFriendsErrorMessages,
	GetFriendsRequestsErrorMessages,
	PublicUser,
	RemoveFriendErrorMessages,
	SendRequestErrorMessages,
} from '../types/friends'
import { UserShowableData } from '../types/userShowableData'

type GetFriendsResponse =
	| ErrorMessage<GetFriendsErrorMessages>
	| SuccessMessage<'Successfully got friends', { friends: PublicUser[] }>

type AddFriendsResponse = AddFriendErrorMessages | SuccessMessage<'Successfully added friend', void>

type SendFriendRequestResponse = SuccessMessage<'Friend request send', void> | ErrorMessage<SendRequestErrorMessages>

type GetFriendRequestsResponse =
	| SuccessMessage<'Successfully got friend requests', { friendRequestsWithUsers: FriendRequestsWithUsers[] }>
	| ErrorMessage<GetFriendsRequestsErrorMessages>

type RemoveFriendResponse =
	| SuccessMessage<'Successfully removed friend', void>
	| ErrorMessage<RemoveFriendErrorMessages>

@Injectable()
export class FriendsService {
	async getFriends(id: number): Promise<GetFriendsResponse> {
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
			let friends: PublicUser[] = []

			user.friends.forEach((friend: User) => {
				friends.push({
					id: friend.id,
					username: friend.username,
					displayName: friend.displayName,
					birthdayDay: friend.birthdayDay,
					birthdayMonth: friend.birthdayMonth,
					birthdayYear: friend.birthdayYear,
					userImage: friend.userImage,
					color: friend.color,
					textStatus: friend.textStatus,
					onlineStatus: friend.onlineStatus,
					phoneNumber: user.phoneNumber,
					createdAt: friend.createdAt,
				})
			})
			return {
				success: true,
				message: 'Successfully got friends',
				payload: {
					friends: friends,
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

	async removeFriend(id: number, { friendId }: { friendId: number }): Promise<RemoveFriendResponse> {
		try {
			// Проверяем, что пользователь существует
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

			// Проверяем, что удаляемый друг существует
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

			// Удаляем друга из списка друзей пользователя
			const updatedUser: User = await prisma.user.update({
				where: {
					id,
				},
				data: {
					friends: {
						disconnect: {
							id: friendId,
						},
					},
				},
			})

			const updatedFriendUser: User = await prisma.user.update({
				where: {
					id: friendId,
				},
				data: {
					friends: {
						disconnect: {
							id,
						},
					},
				},
			})

			if (updatedUser && updatedFriendUser) {
				return {
					success: true,
					message: 'Successfully removed friend',
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
}
