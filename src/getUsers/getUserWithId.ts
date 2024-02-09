import { User } from '@prisma/client'
import { ErrorMessage, SuccessMessage } from '../types/Messages'
import { GetUserWithIdErrorMessages, UserPublicData } from '../types/user'
import prisma from '../../prisma/client'

export type GetUserWithIdResponse =
	| SuccessMessage<'Successfully got user', { user: UserPublicData }>
	| ErrorMessage<GetUserWithIdErrorMessages>

const getUserWithId = async (id: number): Promise<GetUserWithIdResponse> => {
	try {
		const user: User = await prisma.user.findFirst({
			where: {
				id,
			},
		})
		if (!user) {
			return {
				success: false,
				message: 'No user found error',
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
					showname: user.showname,
					birthdayDay: user.birthdayDay,
					birthdayMonth: user.birthdayMonth,
					birthdayYear: user.birthdayYear,
					userImage: user.userImage,
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

export default getUserWithId
