import { FriendRequest, User, UserGroup } from '@prisma/client'
import { ErrorMessage, SuccessMessage } from './responseMessages'

export type UserWithoutPassword = Omit<User, 'password'>

export type UserShowableData = Omit<User, 'email' | 'password' | 'phoneNumber' | 'phoneCode' | 'updatedAt'>

export type GetUsersWithJwtErrorMessages = 'Unauthorized'

export type GetUserWithIdErrorMessages = 'Unauthorized'

type UpdateUserErrorMessages = 'Unauthorized'

type UpdatePhoneNumberErrorMessages = 'Unauthorized' | 'Error updating phone number'

type UpdateUsernameErrorMessages = 'Unauthorized' | 'Wrong password'

export type UserIncludes = {
	groups?: UserGroup[]
	friends?: User[]
	sentRequests?: FriendRequest[]
	receivedRequests?: FriendRequest[]
}

export type UpdateUsernameRequestData = { username: string; password: string }

export type UpdateDisplayNameRequestData = { displayName: string }

type UploadUserImageErrorMessages = 'Unauthorized' | 'Error parsing image' | 'Failed to update user'

export type UpdatePhoneNumberRequestData = {
	code: number
	phoneNumber: string
}

export type UpdateUserResponse =
	| SuccessMessage<'DisplayName successfully updated', { user: UserWithoutPassword }>
	| ErrorMessage<UpdateUserErrorMessages>

export type UpdateUsernameResponse =
	| SuccessMessage<'Username successfully updated', { user: UserWithoutPassword }>
	| ErrorMessage<UpdateUsernameErrorMessages>

export type UploadUserImageResponse =
	| SuccessMessage<'Successfully uploaded', { user: UserWithoutPassword }>
	| ErrorMessage<UploadUserImageErrorMessages>

export type UpdatePhoneNumberResponse =
	| SuccessMessage<'Successfully updated phone number', { user: UserWithoutPassword }>
	| ErrorMessage<UpdatePhoneNumberErrorMessages>

export type GetUserWithIdResponse =
	| SuccessMessage<'Successfully got user', { user: UserShowableData }>
	| ErrorMessage<'Error getting user'>
