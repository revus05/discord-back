import { Injectable } from '@nestjs/common'
import { Prisma, User } from '@prisma/client'
import prisma from '../../../prisma/client'
import { RegisterRequestBody, RegisterUserErrorMessages } from '../../types/register'
import { ErrorMessage, SuccessMessage } from '../../types/Messages'

export type RegisterResponse =
	| SuccessMessage<'Registration completed', undefined>
	| ErrorMessage<RegisterUserErrorMessages>

@Injectable()
export class RegisterService {
	async register(requestBody: RegisterRequestBody): Promise<RegisterResponse> {
		try {
			const user: User = await prisma.user.create({
				data: {
					email: requestBody.email,
					username: requestBody.username,
					showname: requestBody.showname,
					birthdayDay: requestBody.birthdayDay,
					birthdayMonth: requestBody.birthdayMonth,
					birthdayYear: requestBody.birthdayYear,
					userImage: requestBody.userImage,
					password: requestBody.password,
				},
			})
			if (user) {
				return {
					success: true,
					message: 'Registration completed',
				}
			}
		} catch (e) {
			if (e instanceof Prisma.PrismaClientKnownRequestError) {
				if (e.code === 'P2002') {
					console.log('User with this email already exists')
					return {
						success: false,
						message: 'User with this email already exists',
					}
				}
			}
			console.log('Registration failed', e)
			return {
				success: false,
				message: 'Registration failed',
			}
		}
	}
}
