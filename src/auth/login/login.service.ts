import * as bcrypt from 'bcryptjs'
import prisma from '../../../prisma/client'
import { UserWithoutPassword } from '../../types/userShowableData'
import { LoginWithCredentialsErrorMessages, LoginCredentials } from '../../types/login'
import { ErrorMessage, SuccessMessage } from '../../types/Messages'
import { Injectable } from '@nestjs/common'
import { User } from '@prisma/client'
import * as JWT from 'jsonwebtoken'

export type LoginWithCredentials =
	| SuccessMessage<'Authorized', { user: UserWithoutPassword; jwt: string }>
	| ErrorMessage<LoginWithCredentialsErrorMessages>

@Injectable()
export class LoginService {
	async loginWithCredentials(requestBody: LoginCredentials): Promise<LoginWithCredentials> {
		try {
			// checking if the user with this email exists
			const user: User = await prisma.user.findFirst({
				where: {
					email: requestBody.email,
				},
			})

			// if user doesn't exist, returning 'Unauthorized'
			if (!user) {
				return {
					success: false,
					message: 'Unauthorized',
				}
			}

			// checking if provided password is equals to user's password
			const isPasswordMatch = await bcrypt.compare(requestBody.password, user.password)

			// if provided password doesn't equal to user's password, returning 'Unauthorized'
			if (!isPasswordMatch) {
				return {
					success: false,
					message: 'Unauthorized',
				}
			}

			// Separate user data from the password to send to the client
			const { password, ...userWithoutPassword } = user
			return {
				success: true,
				message: 'Authorized',
				payload: {
					user: { ...userWithoutPassword },
					jwt: JWT.sign({ id: user.id }, process.env.SECRET, { expiresIn: '30d' }),
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
}
