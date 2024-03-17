import { Injectable } from '@nestjs/common'
import prisma from '../../prisma/client'
import { MessageBody } from './gateway'
import getIdWithJwt from '../utils/getIdWithJwt'
import { Message } from '@prisma/client'

@Injectable()
export class MessagesService {
	async addMessage(newMessage: MessageBody) {
		const response = getIdWithJwt(newMessage.jwt)
		if (!response.success) {
			return {
				success: false,
				message: 'Unauthorized',
			}
		}
		const id = response.payload.id
		try {
			console.log(newMessage)
			const message: Message = await prisma.message.create({
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

	async getMessages() {
		try {
			const messages: Message[] = await prisma.message.findMany({})
			return {
				success: true,
				message: 'Successfully got message',
				payload: {
					messages,
				},
			}
		} catch (e) {
			console.log(e)
		}
	}
}
