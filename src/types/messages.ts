import { ErrorMessage, SuccessMessage } from './responseMessages'
import { Message } from '@prisma/client'

export type SendMessageBody = {
	text: string
	jwt: string
	chatId: number
}

type SendMessageErrorMessages = 'Unauthorized'

export type SendMessageResponse =
	| SuccessMessage<'Message sent successfully', { message: Message }>
	| ErrorMessage<SendMessageErrorMessages>
