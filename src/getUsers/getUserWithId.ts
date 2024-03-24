import { Prisma, User } from '@prisma/client'
import prisma from '../../prisma/client'
import { ErrorMessage, SuccessMessage } from '../types/responseMessages'
import { GetUserWithIdErrorMessages, UserIncludes, UserWithoutPassword } from '../types/users'

export type GetUserWithIdResponse =
	| SuccessMessage<'Successfully got user', { user: UserWithoutPassword & UserIncludes }>
	| ErrorMessage<GetUserWithIdErrorMessages>

const getUserWithId = async (id: number, include?: Prisma.UserInclude): Promise<GetUserWithIdResponse> => {
	try {
		// getting user from db
		const user: User & UserIncludes = await prisma.user.findFirst({
			where: {
				id,
			},
			include,
		})
		// checking if the user exists
		if (!user) {
			return {
				success: false,
				message: 'Unauthorized',
			}
		}

		// separating user's data from password
		const { password, ...userWithoutPassword } = user
		return {
			success: true,
			message: 'Successfully got user',
			payload: {
				user: {
					...userWithoutPassword,
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
