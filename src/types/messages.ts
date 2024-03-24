import { ErrorMessage, SuccessMessage } from './responseMessages'
import { Message } from '@prisma/client'

export type SendMessageBody = {
	text: string
	jwt: string
	receiverId?: number
	groupId?: string
}

type SendMessageErrorMessages = 'Unauthorized'

type GetUserMessagesErrorMessages = 'Unauthorized'

type GetGroupMessagesErrorMessages = 'Unauthorized'

export type SendMessageResponse =
	| SuccessMessage<'Message sent successfully', { message: Message }>
	| ErrorMessage<SendMessageErrorMessages>

export type GetUserMessagesResponse =
	| SuccessMessage<'Successfully got message', { messages: Message[] }>
	| ErrorMessage<GetUserMessagesErrorMessages>

export type GetGroupMessagesResponse =
	| SuccessMessage<'Successfully got group messages', { messages: Message[] }>
	| ErrorMessage<GetGroupMessagesErrorMessages>
