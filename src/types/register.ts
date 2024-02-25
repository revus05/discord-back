export type RegisterRequestBody = {
	email: string
	displayName: string
	username: string
	birthdayYear: string
	birthdayMonth: string
	birthdayDay: string
	userImage: string | null
	password: string
}

export type RegisterUserErrorMessages = 'Registration failed' | 'User with this email already exists'
