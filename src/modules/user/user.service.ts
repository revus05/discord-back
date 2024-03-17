import { Injectable } from '@nestjs/common'
import { ErrorMessage, SuccessMessage } from '../../types/responseMessages'
import {
	UpdateDisplayNameRequestData,
	UpdateUserErrorMessages,
	UpdateUsernameErrorMessages,
	UpdateUsernameRequestData,
	UserWithoutPassword,
} from '../../types/userShowableData'
import { User } from '@prisma/client'
import prisma from '../../../prisma/client'
import * as bcrypt from 'bcryptjs'
import getIdWithJwt from '../../utils/getIdWithJwt'

export type UpdateUserResponse =
	| SuccessMessage<'DisplayName successfully updated', { user: UserWithoutPassword }>
	| ErrorMessage<UpdateUserErrorMessages>

export type UpdateUsernameResponse =
	| SuccessMessage<'Username successfully updated', { user: UserWithoutPassword }>
	| ErrorMessage<UpdateUsernameErrorMessages>

@Injectable()
export class UserService {
	async updateUserDisplayName(
		jwt: string,
		{ displayName }: UpdateDisplayNameRequestData,
	): Promise<UpdateUserResponse> {
		// getting id
		const response = getIdWithJwt(jwt)
		if (!response.success) {
			return {
				success: false,
				message: 'Unauthorized',
			}
		}
		const id = response.payload.id
		try {
			// updating displayName
			const user: User = await prisma.user.update({
				where: {
					id,
				},
				data: {
					displayName: displayName,
				},
			})
			if (!user) {
				return {
					success: false,
					message: 'Unauthorized',
				}
			}

			// separating password from user's data
			const { password, ...userWithoutPassword } = user
			return {
				success: true,
				message: 'DisplayName successfully updated',
				payload: {
					user: userWithoutPassword,
				},
			}
		} catch (e) {
			console.error(e)
			return {
				success: false,
				message: 'Server error',
			}
		}
	}

	async updateUsername(
		jwt: string,
		{ username, password }: UpdateUsernameRequestData,
	): Promise<UpdateUsernameResponse> {
		// getting id
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

			// checking if provided password correct
			const success = await bcrypt.compare(password, user.password)
			if (!success) {
				return {
					success: false,
					message: 'Wrong password',
				}
			}

			// updating username
			const updatedUser: User = await prisma.user.update({
				where: {
					id: user.id,
				},
				data: {
					username: username,
				},
			})
			if (updatedUser) {
				// splitting password from user's data
				const { password, ...updatedUserWithoutPassword } = updatedUser
				return {
					success: true,
					message: 'Username successfully updated',
					payload: {
						user: updatedUserWithoutPassword,
					},
				}
			}

			return {
				success: false,
				message: 'Server error',
			}
		} catch (e) {
			console.error(e)
			return {
				success: false,
				message: 'Server error',
			}
		}
	}
}
