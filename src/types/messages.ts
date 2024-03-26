import { ErrorMessage, SuccessMessage } from './responseMessages'
import { Message } from '@prisma/client'

export type SendMessageBody = {
	text: string
	jwt: string
	chatId: number
}

type SendMessageErrorMessages = 'Unauthorized'

type GetUserMessagesErrorMessages = 'Unauthorized' | 'Wrong chat'

export type SendMessageResponse =
	| SuccessMessage<'Message sent successfully', { message: Message }>
	| ErrorMessage<SendMessageErrorMessages>

export type GetUserMessagesResponse =
	| SuccessMessage<'Successfully got message', { messages: Message[] }>
	| ErrorMessage<GetUserMessagesErrorMessages>
