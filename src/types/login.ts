import { ErrorMessage, SuccessMessage } from './responseMessages'
import { UserWithoutPassword } from './users'

export type LoginCredentials = {
	email: string
	password: string
}

export type LoginWithCredentialsErrorMessages = 'Unauthorized'

export type loginWithCredentialsResponse =
	| ErrorMessage<LoginWithCredentialsErrorMessages>
	| SuccessMessage<'Authorized', { user: UserWithoutPassword }>
