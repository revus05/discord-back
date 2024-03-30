import { ErrorMessage, SuccessMessage } from './responseMessages'
import { Chat, Message } from '@prisma/client'
import { UserShowableData } from './users'

export type GetChatsResponse =
	| SuccessMessage<'Successfully got chats', { chats: (ChatWithParticipants & { messages: Message[] })[] }>
	| ErrorMessage<'Unauthorized'>

export type ChatWithParticipants = Chat & { participants: UserShowableData[] }
