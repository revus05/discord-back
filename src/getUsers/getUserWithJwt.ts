import { User } from '@prisma/client'
import { GetUsersWithJwtErrorMessages, UserWithoutPassword } from '../types/userShowableData'
import prisma from '../../prisma/client'
import getIdWithJwt from '../logic/getIdWithJwt'
import { ErrorMessage, SuccessMessage } from '../types/Messages'

export type GetUserWithJwtResponse =
	| SuccessMessage<'Successfully got user', { user: UserWithoutPassword }>
	| ErrorMessage<GetUsersWithJwtErrorMessages>

const getUserWithJwt = async (jwt: string): Promise<GetUserWithJwtResponse> => {
	// получаем id пользователя из jwt
	const response = getIdWithJwt(jwt)
	if (!response.success) {
		return {
			success: false,
			message: 'Unauthorized',
		}
	}
	try {
		const user: User = await prisma.user.findFirst({
			where: {
				id: response.payload.id,
			},
		})
		if (!user) {
			return {
				success: false,
				message: 'No user with your data',
			}
		}

		const { password, ...userWithoutPassword } = user

		return {
			success: true,
			message: 'Successfully got user',
			payload: {
				user: { ...userWithoutPassword },
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

export default getUserWithJwt
