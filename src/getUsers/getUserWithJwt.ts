import { Prisma, User } from '@prisma/client'
import { GetUsersWithJwtErrorMessages, UserIncludes, UserWithoutPassword } from '../types/userShowableData'
import prisma from '../../prisma/client'
import getIdWithJwt from '../utils/getIdWithJwt'
import { ErrorMessage, SuccessMessage } from '../types/Messages'

export type GetUserWithJwtResponse =
	| SuccessMessage<'Successfully got user', { user: UserWithoutPassword & UserIncludes }>
	| ErrorMessage<GetUsersWithJwtErrorMessages>

const getUserWithJwt = async (jwt: string, include?: Prisma.UserInclude): Promise<GetUserWithJwtResponse> => {
	// getting user id from jwt
	const response = getIdWithJwt(jwt)
	if (!response.success) {
		return {
			success: false,
			message: 'Unauthorized',
		}
	}
	try {
		// checking if the user exists
		const user: User & UserIncludes = await prisma.user.findFirst({
			where: {
				id: response.payload.id,
			},
			include,
		})
		// if user doesn't exist, returning 'Unauthorized'
		if (!user) {
			return {
				success: false,
				message: 'Unauthorized',
			}
		}

		// Separate user data from the password
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
