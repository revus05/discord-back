import { Injectable } from '@nestjs/common'
import prisma from '../../../prisma/client'
import { Chat, User } from '@prisma/client'
import getUserWithJwt from '../../getUsers/getUserWithJwt'
import getUserWithId from '../../getUsers/getUserWithId'
import { GetFriendsResponse, PublicUser, RemoveFriendResponse } from '../../types/friends'
import getIdWithJwt from '../../utils/getIdWithJwt'

@Injectable()
export class FriendsService {
	async getFriends(jwt: string): Promise<GetFriendsResponse> {
		const response = getIdWithJwt(jwt)
		if (!response.success) {
			return {
				success: false,
				message: 'Unauthorized',
			}
		}
		const id = response.payload.id
		try {
			// getting user
			const user: User & { friends: User[]; chat: (Chat & { participants: User[] })[] } =
				await prisma.user.findFirst({
					where: {
						id,
					},
					include: {
						friends: true,
						chat: {
							include: {
								participants: true,
							},
						},
					},
				})

			// getting user's friends and converting them to proper type
			let friends: (PublicUser & { chatId: number })[] = []
			user.friends.forEach((friend: User) => {
				const { password, ...userWithoutPassword } = friend
				const chat: Chat & { participants: User[] } = user.chat.find((chat: Chat & { participants: User[] }) =>
					chat.participants.find((participant: User) => participant.id === friend.id),
				)
				friends.push({ ...userWithoutPassword, chatId: chat.id })
			})
			return {
				success: true,
				message: 'Successfully got friends',
				payload: {
					friends,
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

	async removeFriend(jwt: string, friendId: number): Promise<RemoveFriendResponse> {
		try {
			// checking that user exists
			const response = await getUserWithJwt(jwt)
			if (!response.success) {
				return {
					success: false,
					message: 'Unauthorized',
				}
			}
			const id = response.payload.user.id

			// checking that friend exists
			const getFriendsResponse = await getUserWithId(friendId)
			if (!getFriendsResponse.success) {
				return {
					success: false,
					message: 'Friend not found',
				}
			}

			// delete friend from user's friends
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

			// delete user from friend's friends
			const updatedFriend: User = await prisma.user.update({
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

			const { password, ...updatedFriendWithoutPassword } = updatedFriend
			if (updatedUser && updatedFriendWithoutPassword) {
				return {
					success: true,
					message: 'Successfully removed friend',
					payload: {
						friend: updatedFriendWithoutPassword,
					},
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
