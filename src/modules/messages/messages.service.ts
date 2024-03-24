import { Injectable } from '@nestjs/common'
import prisma from '../../../prisma/client'
import getIdWithJwt from '../../utils/getIdWithJwt'
import { Message } from '@prisma/client'
import {
	GetGroupMessagesResponse,
	GetUserMessagesResponse,
	SendMessageBody,
	SendMessageResponse,
} from '../../types/messages'

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
			let message: Message
			if (newMessage.receiverId) {
				message = await prisma.message.create({
					data: {
						text: newMessage.text,
						sender: {
							connect: {
								id: id,
							},
						},
						receiver: {
							connect: {
								id: +newMessage.receiverId,
							},
						},
					},
				})
			} else {
				message = await prisma.message.create({
					data: {
						text: newMessage.text,
						sender: {
							connect: {
								id: id,
							},
						},
						group: {
							connect: {
								id: newMessage.groupId,
							},
						},
					},
				})
			}
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

	async getUserMessages(jwt: string, userId: number): Promise<GetUserMessagesResponse> {
		const response = getIdWithJwt(jwt)
		if (!response.success) {
			return {
				success: false,
				message: 'Unauthorized',
			}
		}
		const id = response.payload.id
		try {
			const messages: Message[] = await prisma.message.findMany({
				where: {
					OR: [
						{
							senderId: userId,
							receiverId: id,
						},
						{
							senderId: id,
							receiverId: userId,
						},
					],
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

	async getGroupMessages(jwt: string, groupId: string): Promise<GetGroupMessagesResponse> {
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
	}
}
