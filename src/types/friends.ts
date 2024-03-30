import { UserShowableData } from './users'
import { ErrorMessage, SuccessMessage } from './responseMessages'

type GetFriendsErrorMessages = 'Unauthorized'

type RemoveFriendErrorMessages = 'Unauthorized' | 'Friend not found'

export type AcceptFriendRequestRequestBody = { requestId: number }

export type SendFriendRequestRequestBody = { username: string }

export type GetFriendsResponse =
	| ErrorMessage<GetFriendsErrorMessages>
	| SuccessMessage<'Successfully got friends', { friends: (UserShowableData & { chatId: number })[] }>

export type RemoveFriendResponse =
	| SuccessMessage<'Successfully removed friend', { friend: UserShowableData }>
	| ErrorMessage<RemoveFriendErrorMessages>
