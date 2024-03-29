import { Injectable } from '@nestjs/common'
import getIdWithJwt from '../../utils/getIdWithJwt'
import prisma from '../../../prisma/client'
import { getChatsResponse } from '../../types/chats'
import { Chat, Message, User } from '@prisma/client'
import { UserWithoutPassword } from '../../types/users'

@Injectable()
export class ChatsService {
	async getChats(jwt: string): Promise<getChatsResponse> {
		const response = getIdWithJwt(jwt)
		if (!response.success) {
			return {
				success: false,
				message: 'Unauthorized',
			}
		}
		const id = response.payload.id
		try {
			// getting all user's chats
			const user: User & { chat: (Chat & { messages: Message[]; participants: User[] })[] } =
				await prisma.user.findUnique({
					where: {
						id: id,
					},
					include: {
						chat: {
							include: {
								messages: true,
								participants: true,
							},
						},
					},
				})

			let chats: (Chat & { messages: Message[]; participants: UserWithoutPassword[] })[] = []

			// converting chats type
			user.chat.forEach((chat: Chat & { messages: Message[]; participants: User[] }) => {
				let participantsWithoutPassword = []
				chat.participants.forEach(participant => {
					const { password, ...participantWithoutPassword } = participant
					participantsWithoutPassword.push(participantWithoutPassword)
				})
				chats.push({ ...chat, participants: participantsWithoutPassword })
			})

			return {
				success: true,
				message: 'Successfully got chats',
				payload: {
					chats,
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