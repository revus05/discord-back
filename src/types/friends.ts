import { ErrorMessage } from './Messages'
import { User } from '@prisma/client'

export type GetFriendsErrorMessages = 'Unauthorized'

export type AddFriendErrorMessages = ErrorMessage<
	'Unauthorized' | 'User cant add yourself to friends' | 'User already your friend'
>

export type PublicUser = Omit<User, 'email' | 'updatedAt' | 'password'>
