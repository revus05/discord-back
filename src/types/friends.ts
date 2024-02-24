import { ErrorMessage } from './Messages'

export type GetFriendsErrorMessages = 'Unauthorized'

export type AddFriendErrorMessages = ErrorMessage<
	'Unauthorized' | 'User cant add yourself to friends' | 'User already your friend'
>
