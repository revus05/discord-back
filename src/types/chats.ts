import { ErrorMessage, SuccessMessage } from './responseMessages'
import { Chat, Message, User } from '@prisma/client'

export type getChatsResponse =
	| SuccessMessage<'Successfully got chats', { chats: (Chat & { messages: Message[] })[] }>
	| ErrorMessage<'Unauthorized'>
