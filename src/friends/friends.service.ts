import { Injectable } from '@nestjs/common'
import prisma from '../../prisma/client'
import { User } from '@prisma/client'
import { ErrorMessage, SuccessMessage } from '../types/Messages'
import { AddFriendErrorMessages, GetFriendsErrorMessages, PublicUser } from '../types/friends'

type GetFriendsResponse =
	| ErrorMessage<GetFriendsErrorMessages>
	| SuccessMessage<'Successfully got friends', { friends: PublicUser[] }>

type AddFriendsResponse = AddFriendErrorMessages | SuccessMessage<'Successfully got friends', void>

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

	async addFriend(id: number, { friendId }: { friendId: number }): Promise<AddFriendsResponse> {
		if (id === friendId) {
			return {
				success: false,
				message: 'User cant add yourself to friends',
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
				if (updatedUser) {
					return {
						success: true,
						message: 'Successfully got friends',
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
