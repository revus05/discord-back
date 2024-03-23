import { FriendRequest, User, UserGroup } from '@prisma/client'

export type UserWithoutPassword = Omit<User, 'password'>

export type UserShowableData = Omit<User, 'email' | 'password' | 'phoneNumber' | 'phoneCode' | 'updatedAt'>

export type GetUsersWithJwtErrorMessages = 'Unauthorized'

export type GetUserWithIdErrorMessages = 'Unauthorized'

export type UpdateUserErrorMessages = 'Unauthorized'

export type UpdatePhoneNumberErrorMessages = 'Unauthorized' | 'Error updating phone number'

export type UpdateUsernameErrorMessages = 'Unauthorized' | 'Wrong password'

export type UserIncludes = {
	groups?: UserGroup[]
	friends?: User[]
	sentRequests?: FriendRequest[]
	receivedRequests?: FriendRequest[]
}

export type UpdateUsernameRequestData = { username: string; password: string }

export type UpdateDisplayNameRequestData = { displayName: string }

export type UploadUserImageErrorMessages = 'Unauthorized' | 'Error parsing image' | 'Failed to update user'

export type UpdatePhoneNumberRequestData = {
	code: number
	phoneNumber: string
}
