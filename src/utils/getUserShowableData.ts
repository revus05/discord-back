import { UserShowableData, UserWithoutPassword } from '../types/userShowableData'

const getUserShowableData = (user: UserWithoutPassword): UserShowableData => {
	const { email, phoneNumber, updatedAt, ...userShowableData } = user
	return userShowableData
}

export default getUserShowableData
