import { ErrorMessage, SuccessMessage } from './responseMessages'
import { UserShowableData, UserWithoutPassword } from './users'
import { FriendRequest } from '@prisma/client'

type GetFriendsRequestsErrorMessages = 'Unauthorized'

export type FriendRequestsWithUsers = {
	friendRequest: FriendRequest
	fromUser: UserShowableData
	toUser: UserShowableData
}

type SendRequestErrorMessages =
	| 'Unauthorized'
	| "You're already friends with that user"
	| 'Incorrect username'
	| 'Request already sent to this user'
	| "You can't yourself to friends"

type AddFriendErrorMessages =
	| 'Unauthorized'
	| 'User cant add himself to friends'
	| 'User already your friend'
	| 'Friend user not found'

type DeleteFriendRequestErrorMessages = 'Unauthorized' | 'Wrong request id provided'

export type GetFriendRequestsResponse =
	| SuccessMessage<'Successfully got friend requests', { friendRequestsWithUsers: FriendRequestsWithUsers[] }>
	| ErrorMessage<GetFriendsRequestsErrorMessages>

export type SendFriendRequestResponse =
	| SuccessMessage<'Friend request send', { friend: UserShowableData }>
	| ErrorMessage<SendRequestErrorMessages>

export type AddFriendRequestResponse =
	| ErrorMessage<AddFriendErrorMessages>
	| SuccessMessage<'Successfully added friend', { friend: UserWithoutPassword }>

export type DeleteFriendRequestResponse =
	| SuccessMessage<'Request deleted successfully', { deletedRequest: FriendRequest }>
	| ErrorMessage<DeleteFriendRequestErrorMessages>
