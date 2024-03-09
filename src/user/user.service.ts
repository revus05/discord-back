import { Injectable } from '@nestjs/common'
import { ErrorMessage, SuccessMessage } from '../types/messages'
import { UpdateUserErrorMessages, UpdateUsernameErrorMessages } from '../types/userShowableData'
import { User } from '@prisma/client'
import prisma from '../../prisma/client'
import * as bcrypt from 'bcryptjs'

type UpdateUserResponse =
	| SuccessMessage<'DisplayName successfully updated', void>
	| ErrorMessage<UpdateUserErrorMessages>

type UpdateUsernameResponse =
	| SuccessMessage<'Username successfully updated', void>
	| ErrorMessage<UpdateUsernameErrorMessages>

@Injectable()
export class UserService {
	async updateUserDisplayName(id: number, { displayName }: { displayName: string }): Promise<UpdateUserResponse> {
		try {
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
			return {
				success: true,
				message: 'DisplayName successfully updated',
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
		id: number,
		{ username, password }: { username: string; password: string },
	): Promise<UpdateUsernameResponse> {
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
			const success = await bcrypt.compare(password, user.password)
			if (!success) {
				return {
					success: false,
					message: 'Wrong password',
				}
			}
			const updatedUser: User = await prisma.user.update({
				where: {
					id: user.id,
				},
				data: {
					username: username,
				},
			})
			if (!updatedUser) {
				return {
					success: false,
					message: 'Server error',
				}
			}
			return {
				success: true,
				message: 'Username successfully updated',
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
