import { Injectable } from '@nestjs/common'
import { ErrorMessage, SuccessMessage } from '../types/Messages'
import { updateUserData, UpdateUserErrorMessages } from '../types/user'
import { User } from '@prisma/client'
import prisma from '../../prisma/client'

type UpdateUserResponse = SuccessMessage<'Data successfully updated', void> | ErrorMessage<UpdateUserErrorMessages>

@Injectable()
export class UserService {
	async updateUser(id: number, updateData: updateUserData): Promise<UpdateUserResponse> {
		try {
			const user: User = await prisma.user.update({
				where: {
					id,
				},
				data: {
					...updateData,
				},
			})
			console.log(user)
			if (!user) {
				return {
					success: false,
					message: 'Unauthorized',
				}
			}
			return {
				success: true,
				message: 'Data successfully updated',
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
