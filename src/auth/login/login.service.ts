import { Injectable } from '@nestjs/common'
import { User } from '@prisma/client'
import * as bcrypt from 'bcryptjs'
import prisma from '../../../prisma/client'
import { UserPublicData } from '../../types/user'
import { GetUserWithCredentialsErrorMessages, LoginRequestBody } from '../../types/login'
import { ErrorMessage, SuccessMessage } from '../../types/Messages'

type GetUserWithCredentials =
	| SuccessMessage<'Authorized', { user: UserPublicData }>
	| ErrorMessage<GetUserWithCredentialsErrorMessages>

@Injectable()
export class LoginService {
	async getUserWithCredentials(requestBody: LoginRequestBody): Promise<GetUserWithCredentials> {
		try {
			const user: User = await prisma.user.findFirst({
				where: {
					email: requestBody.email,
				},
			})
			if (user) {
				const success = await bcrypt.compare(requestBody.password, user.password)
				if (!success) {
					return {
						success: false,
						message: 'Unauthorized',
					}
				}
				return {
					success: true,
					message: 'Authorized',
					payload: {
						user: {
							id: user.id,
							email: user.email,
							username: user.username,
							showname: user.showname,
							birthdayDay: user.birthdayDay,
							birthdayMonth: user.birthdayMonth,
							birthdayYear: user.birthdayYear,
							userImage: user.userImage,
							color: user.color,
							createdAt: user.createdAt,
							updatedAt: user.updatedAt,
						},
					},
				}
			} else {
				return {
					success: false,
					message: 'Unauthorized',
				}
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
