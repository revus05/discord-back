import { User } from '@prisma/client'
import { UserWithoutPassword } from './users'
import { ErrorMessage, SuccessMessage } from './responseMessages'

type GetFriendsErrorMessages = 'Unauthorized'

export type PublicUser = Omit<User, 'email' | 'updatedAt' | 'password'>

type RemoveFriendErrorMessages = 'Unauthorized' | 'Friend not found'

export type AcceptFriendRequestRequestBody = { requestId: number }

export type SendFriendRequestRequestBody = { username: string }

export type GetFriendsResponse =
	| ErrorMessage<GetFriendsErrorMessages>
	| SuccessMessage<'Successfully got friends', { friends: (PublicUser & { chatId: number })[] }>

export type RemoveFriendResponse =
	| SuccessMessage<'Successfully removed friend', { friend: UserWithoutPassword }>
	| ErrorMessage<RemoveFriendErrorMessages>
