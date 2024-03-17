import { Injectable } from '@nestjs/common'
import prisma from '../../../prisma/client'
import getIdWithJwt from '../../utils/getIdWithJwt'
import { Message } from '@prisma/client'
import { GetMessagesErrorMessages, SendMessageBody, SendMessageErrorMessages } from '../../types/messages'
import { ErrorMessage, SuccessMessage } from '../../types/responseMessages'

type SendMessageResponse =
	| SuccessMessage<'Message sent successfully', { message: Message }>
	| ErrorMessage<SendMessageErrorMessages>

type GetMessagesResponse =
	| SuccessMessage<'Successfully got message', { messages: Message[] }>
	| ErrorMessage<GetMessagesErrorMessages>

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

	async getMessages(jwt: string, userId: number): Promise<GetMessagesResponse> {
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
		}
	}
}
