import { Injectable } from '@nestjs/common'

import { User } from '@prisma/client'
import prisma from '../../../prisma/client'
import * as bcrypt from 'bcryptjs'
import getIdWithJwt from '../../utils/getIdWithJwt'
import * as fs from 'fs'
import * as path from 'path'
import {
	UpdateDisplayNameRequestData,
	UpdatePhoneNumberRequestData,
	UpdatePhoneNumberResponse,
	UpdateUsernameRequestData,
	UpdateUsernameResponse,
	UpdateUserResponse,
	UploadUserImageResponse,
} from '../../types/users'

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

	async uploadUserImage(jwt: string, file: Express.Multer.File): Promise<UploadUserImageResponse> {
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
			// moving file (image) to `${process.cwd()}/public/avatars` folder
			const targetPath = `${process.cwd()}/public/avatars`
			if (!fs.existsSync(targetPath)) {
				fs.mkdirSync(targetPath, { recursive: true })
			}
			fs.rename(file.path, path.join(targetPath, file.originalname), err => {
				if (err) {
					return {
						success: false,
						message: 'Error parsing image',
					}
				}
			})

			// updating userImage
			const user: User = await prisma.user.update({
				where: {
					id,
				},
				data: {
					userImage: `http://localhost:5555/${file.originalname}`,
				},
			})

			if (!user) {
				return {
					success: false,
					message: 'Failed to update user',
				}
			}

			const { password, ...userWithoutPassword } = user

			return {
				success: true,
				message: 'Successfully uploaded',
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

	async updatePhoneNumber(jwt: string, data: UpdatePhoneNumberRequestData): Promise<UpdatePhoneNumberResponse> {
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
			const user: User = await prisma.user.update({
				where: {
					id,
				},
				data: {
					phoneCode: data.code,
					phoneNumber: data.phoneNumber,
				},
			})

			if (!user) {
				return {
					success: false,
					message: 'Error updating phone number',
				}
			}
			const { password, ...userWithoutPassword } = user
			return {
				success: true,
				message: 'Successfully updated phone number',
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
}
