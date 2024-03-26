import { Injectable } from '@nestjs/common'
import prisma from '../../../prisma/client'
import getIdWithJwt from '../../utils/getIdWithJwt'
import { Chat, Message, UserChat } from '@prisma/client'
import { GetUserMessagesResponse, SendMessageBody, SendMessageResponse } from '../../types/messages'

@Injectable()
export class MessagesService {
	async sendMessage(newMessage: SendMessageBody): Promise<SendMessageResponse> {
		const response = getIdWithJwt(newMessage.jwt)
		if (!response.success) {
			return {
				success: false,
				message: 'Unauthorized',
			}
		}
		const id = response.payload.id
		try {
			let message: Message = await prisma.message.create({
				data: {
					text: newMessage.text,
					senderId: id,
					chatId: newMessage.chatId,
				},
			})

			if (!message) {
				return {
					success: false,
					message: 'Server error',
				}
			}
			return {
				success: true,
				message: 'Message sent successfully',
				payload: {
					message,
				},
			}
		} catch (e) {
			console.log(e)
			return {
				success: false,
				message: 'Server error',
			}
		}
	}

	async getUserMessages(jwt: string, chatId: number): Promise<GetUserMessagesResponse> {
		const response = getIdWithJwt(jwt)
		if (!response.success) {
			return {
				success: false,
				message: 'Unauthorized',
			}
		}
		const id = response.payload.id
		try {
			const chat: Chat & { userChat: UserChat[] } = await prisma.chat.findFirst({
				where: {
					id: chatId,
				},
				include: {
					userChat: true,
				},
			})
			const isUser: UserChat | undefined = chat.userChat?.find((userChat: UserChat) => userChat.userId === id)
			if (!isUser) {
				return {
					success: false,
					message: 'Wrong chat',
				}
			}

			const messages: Message[] = await prisma.message.findMany({
				where: {
					chatId,
				},
			})
			return {
				success: true,
				message: 'Successfully got message',
				payload: {
					messages,
				},
			}
		} catch (e) {
			console.log(e)
			return {
				success: false,
				message: 'Server error',
			}
		}
	}

	/*async getGroupMessages(jwt: string, groupId: string): Promise<GetGroupMessagesResponse> {
		const response = getIdWithJwt(jwt)
		if (!response.success) {
			return {
				success: false,
				message: 'Unauthorized',
			}
		}
		//const id = response.payload.id
		try {
			const group = await prisma.group.findFirst({
				where: {
					id: groupId,
				},
				select: {
					messages: true,
					users: {
						include: {
							user: true,
						},
					},
				},
			})
			console.log(group)
			return {
				success: true,
				message: 'Successfully got group messages',
				payload: {
					messages: group.messages,
				},
			}
		} catch (e) {
			console.log(e)
			return {
				success: false,
				message: 'Server error',
			}
		}
	}*/
}
