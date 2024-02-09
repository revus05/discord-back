export type RegisterRequestBody = {
	email: string
	showname: string
	username: string
	birthdayYear: number
	birthdayMonth: string
	birthdayDay: number
	userImage: string | null
	password: string
}

export type RegisterUserErrorMessages = 'Registration failed' | 'User with this email already exists'
