import { Injectable } from '@nestjs/common'
import prisma from '../../../prisma/client'
import { User } from '@prisma/client'
import { ErrorMessage, SuccessMessage } from '../../types/responseMessages'
import {
	GetFriendsErrorMessages,
	PublicUser,
	RemoveFriendErrorMessages,
	RemoveFriendRequestBody,
} from '../../types/friends'
import getUserWithJwt, { GetUserWithJwtResponse } from '../../getUsers/getUserWithJwt'
import getUserWithId from '../../getUsers/getUserWithId'
import { UserWithoutPassword } from '../../types/users'

export type GetFriendsResponse =
	| ErrorMessage<GetFriendsErrorMessages>
	| SuccessMessage<'Successfully got friends', { friends: PublicUser[] }>

export type RemoveFriendResponse =
	| SuccessMessage<'Successfully removed friend', { friend: UserWithoutPassword }>
	| ErrorMessage<RemoveFriendErrorMessages>

@Injectable()
export class FriendsService {
	async getFriends(jwt: string): Promise<GetFriendsResponse> {
		try {
			// getting user
			const response: GetUserWithJwtResponse = await getUserWithJwt(jwt, { friends: true })
			if (!response.success) {
				return {
					success: false,
					message: 'Unauthorized',
				}
			}
			const user = response.payload.user

			// getting user's friends and converting them to proper type
			let friends: PublicUser[] = []
			user.friends.forEach((friend: User) => {
				const { password, ...userWithoutPassword } = friend
				friends.push({ ...userWithoutPassword })
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

	async removeFriend(jwt: string, { friendId }: RemoveFriendRequestBody): Promise<RemoveFriendResponse> {
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
