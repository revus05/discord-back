import { ErrorMessage, SuccessMessage } from './responseMessages'
import { UserWithoutPassword } from './users'

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

type RegisterUserErrorMessages = 'User with this email or username already exists'

export type RegisterResponse =
	| SuccessMessage<'Registration completed', { user: UserWithoutPassword }>
	| ErrorMessage<RegisterUserErrorMessages>
