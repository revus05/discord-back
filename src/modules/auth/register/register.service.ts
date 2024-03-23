import { Injectable } from '@nestjs/common'
import { Prisma, User } from '@prisma/client'
import prisma from '../../../../prisma/client'
import { RegisterCredentials, RegisterUserErrorMessages } from '../../../types/register'
import { ErrorMessage, SuccessMessage } from '../../../types/responseMessages'
import * as bcrypt from 'bcryptjs'
import generateNoImageColor from '../../../utils/generateNoImageColor'
import { UserWithoutPassword } from '../../../types/users'

export type RegisterResponse =
	| SuccessMessage<'Registration completed', { user: UserWithoutPassword }>
	| ErrorMessage<RegisterUserErrorMessages>

@Injectable()
export class RegisterService {
	async register(requestBody: RegisterCredentials): Promise<RegisterResponse> {
		try {
			// generating color for users without image
			const color = generateNoImageColor()
			// creating user with provided data
			const user: User = await prisma.user.create({
				data: {
					email: requestBody.email,
					username: requestBody.username,
					displayName: requestBody.displayName,
					birthdayDay: parseInt(requestBody.birthdayDay),
					birthdayMonth: requestBody.birthdayMonth,
					birthdayYear: parseInt(requestBody.birthdayYear),
					userImage: requestBody.userImage,
					password: await bcrypt.hash(requestBody.password, await bcrypt.genSalt(16)),
					textStatus: '',
					phoneNumber: null,
					onlineStatus: 'online',
					color,
				},
			})

			// separating password from userData
			const { password, ...userWithoutPassword } = user
			if (user) {
				return {
					success: true,
					message: 'Registration completed',
					payload: {
						user: userWithoutPassword,
					},
				}
			}
		} catch (e) {
			if (e instanceof Prisma.PrismaClientKnownRequestError) {
				// P2002 unique constraint failed
				if (e.code === 'P2002') {
					return {
						success: false,
						message: 'User with this email or username already exists',
					}
				}
			}
			return {
				success: false,
				message: 'Server error',
			}
		}
	}
}
