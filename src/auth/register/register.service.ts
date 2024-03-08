import { Injectable } from '@nestjs/common'
import { NoImageColors, Prisma, User } from '@prisma/client'
import prisma from '../../../prisma/client'
import { RegisterRequestBody, RegisterUserErrorMessages } from '../../types/register'
import { ErrorMessage, SuccessMessage } from '../../types/Messages'

export type RegisterResponse =
	| SuccessMessage<'Registration completed', undefined>
	| ErrorMessage<RegisterUserErrorMessages>

@Injectable()
export class RegisterService {
	async register(requestBody: RegisterRequestBody): Promise<RegisterResponse> {
		const random = Math.floor(Math.random() * 5)
		let color: NoImageColors = 'blue'
		switch (random) {
			case 1:
				color = 'orange'
				break
			case 2:
				color = 'red'
				break
			case 3:
				color = 'green'
				break
			case 4:
				color = 'blue'
				break
			case 5:
				color = 'yellow'
				break
		}
		try {
			const user: User = await prisma.user.create({
				data: {
					email: requestBody.email,
					username: requestBody.username,
					displayName: requestBody.displayName,
					birthdayDay: parseInt(requestBody.birthdayDay),
					birthdayMonth: requestBody.birthdayMonth,
					birthdayYear: parseInt(requestBody.birthdayYear),
					userImage: requestBody.userImage,
					password: requestBody.password,
					textStatus: '',
					phoneNumber: null,
					onlineStatus: 'online',
					color,
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
					console.log(e)
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
