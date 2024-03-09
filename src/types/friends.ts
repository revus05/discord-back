import { ErrorMessage } from './Messages'
import { FriendRequest, User } from '@prisma/client'
import { UserShowableData } from './userShowableData'

export type GetFriendsErrorMessages = 'Unauthorized'

export type AddFriendErrorMessages = ErrorMessage<
	'Unauthorized' | 'User cant add himself to friends' | 'User already your friend' | 'Friend user not found'
>

export type PublicUser = Omit<User, 'email' | 'updatedAt' | 'password'>

export type SendRequestErrorMessages = 'Unauthorized' | "You're already friends with that user" | 'Incorrect username'

export type GetFriendsRequestsErrorMessages = 'Unauthorized'

export type FriendRequestsWithUsers = {
	friendRequest: FriendRequest
	fromUser: UserShowableData
	toUser: UserShowableData
}

export type RemoveFriendErrorMessages = 'Unauthorized' | 'Friend not found'
