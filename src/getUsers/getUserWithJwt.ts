import { User } from '@prisma/client'
import { GetUsersWithJwtErrorMessages, UserPublicData } from '../types/user'
import prisma from '../../prisma/client'
import getIdWithJwt from '../logic/getIdWithJwt'
import { ErrorMessage, SuccessMessage } from '../types/Messages'

type GetUserWithJwtResponse =
	| SuccessMessage<'Successfully got user', { user: UserPublicData }>
	| ErrorMessage<GetUsersWithJwtErrorMessages>

const getUserWithJwt = async (jwt: string): Promise<GetUserWithJwtResponse> => {
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
		return {
			success: true,
			message: 'Successfully got user',
			payload: {
				user: {
					id: user.id,
					email: user.email,
					username: user.username,
					displayName: user.displayName,
					birthdayDay: user.birthdayDay,
					birthdayMonth: user.birthdayMonth,
					birthdayYear: user.birthdayYear,
					userImage: user.userImage,
					color: user.color,
					textStatus: user.textStatus,
					onlineStatus: user.onlineStatus,
					createdAt: user.createdAt,
					updatedAt: user.updatedAt,
				},
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
