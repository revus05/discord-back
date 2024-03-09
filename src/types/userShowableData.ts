import { FriendRequest, User, UserGroup } from '@prisma/client'

export type UserWithoutPassword = Omit<User, 'password'>

export type UserShowableData = Omit<User, 'email' | 'password' | 'phoneNumber' | 'updatedAt'>

export type GetUsersWithJwtErrorMessages = 'Unauthorized'

export type GetUserWithIdErrorMessages = 'Unauthorized'

export type UpdateUserErrorMessages = 'Unauthorized'

export type UpdateUsernameErrorMessages = 'Unauthorized' | 'Wrong password'

export type UserIncludes = {
	groups?: UserGroup[]
	friends?: User[]
	sentRequests?: FriendRequest[]
	receivedRequests?: FriendRequest[]
}

export type UpdateUsernameRequestData = { username: string; password: string }

export type UpdateDisplayName = { displayName: string }
