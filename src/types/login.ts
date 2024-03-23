import { ErrorMessage, SuccessMessage } from './responseMessages'
import { UserWithoutPassword } from './users'

export type LoginCredentials = {
	email: string
	password: string
}

type LoginWithCredentialsErrorMessages = 'Unauthorized'

export type LoginWithCredentialsResponse =
	| SuccessMessage<'Authorized', { user: UserWithoutPassword; jwt?: string }>
	| ErrorMessage<LoginWithCredentialsErrorMessages>
