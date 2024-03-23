import { UserShowableData, UserWithoutPassword } from '../types/users'

const getUserShowableData = (user: UserWithoutPassword): UserShowableData => {
	const { email, phoneNumber, updatedAt, ...userShowableData } = user
	return userShowableData
}

export default getUserShowableData
