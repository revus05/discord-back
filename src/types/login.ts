import { ErrorMessage, SuccessMessage } from './responseMessages'
import { UserWithoutPassword } from './userShowableData'

export type LoginCredentials = {
	email: string
	password: string
}

export type LoginWithCredentialsErrorMessages = 'Unauthorized'

export type loginWithCredentialsResponse =
	| ErrorMessage<LoginWithCredentialsErrorMessages>
	| SuccessMessage<'Authorized', { user: UserWithoutPassword }>
