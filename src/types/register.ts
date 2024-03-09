export type RegisterCredentials = {
	email: string
	displayName: string
	username: string
	birthdayYear: string
	birthdayMonth: string
	birthdayDay: string
	userImage: string | null
	password: string
}

export type RegisterUserErrorMessages = 'User with this email or username already exists'
