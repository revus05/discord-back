import { FriendRequest, User } from '@prisma/client'
import { UserShowableData } from './users'

export type GetFriendsErrorMessages = 'Unauthorized'

export type AddFriendErrorMessages =
	| 'Unauthorized'
	| 'User cant add himself to friends'
	| 'User already your friend'
	| 'Friend user not found'

export type PublicUser = Omit<User, 'email' | 'updatedAt' | 'password'>

export type SendRequestErrorMessages =
	| 'Unauthorized'
	| "You're already friends with that user"
	| 'Incorrect username'
	| 'Request already sent to this user'
	| "You can't yourself to friends"

export type GetFriendsRequestsErrorMessages = 'Unauthorized'

export type FriendRequestsWithUsers = {
	friendRequest: FriendRequest
	fromUser: UserShowableData
	toUser: UserShowableData
}

export type RemoveFriendErrorMessages = 'Unauthorized' | 'Friend not found'

export type RemoveFriendRequestBody = { friendId: number }

export type AcceptFriendRequestRequestBody = { requestId: number }

export type SendFriendRequestRequestBody = { username: string }

export type DeleteFriendRequestRequestBody = { requestId: number }

export type DeleteFriendRequestErrorMessages = 'Unauthorized' | 'Wrong request id provided'
