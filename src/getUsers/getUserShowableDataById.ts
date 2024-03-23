import prisma from '../../prisma/client'
import { UserShowableData } from '../types/users'

const getUserShowableDataById = async (id: number): Promise<UserShowableData> => {
	return prisma.user.findFirst({
		where: {
			id,
		},
		select: {
			id: true,
			username: true,
			displayName: true,
			birthdayDay: true,
			birthdayMonth: true,
			birthdayYear: true,
			userImage: true,
			color: true,
			textStatus: true,
			onlineStatus: true,
			createdAt: true,
		},
	})
}

export default getUserShowableDataById
