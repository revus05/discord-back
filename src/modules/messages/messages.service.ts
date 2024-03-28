import { Injectable } from '@nestjs/common'
import prisma from '../../../prisma/client'
import getIdWithJwt from '../../utils/getIdWithJwt'
import { Message } from '@prisma/client'
import { SendMessageBody, SendMessageResponse } from '../../types/messages'

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
}
