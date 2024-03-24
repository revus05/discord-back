import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { OnModuleInit } from '@nestjs/common'
import { Server } from 'socket.io'
import { MessagesService } from './messages.service'
import { SendMessageBody } from '../../types/messages'

@WebSocketGateway(8080, {
	cors: {
		origin: '*',
	},
})
export class MyGateway implements OnModuleInit {
	@WebSocketServer()
	server: Server

	onModuleInit() {
		this.server.on('connection', socket => {
			console.log(`Connected ${socket.id}!`)
		})
	}

	@SubscribeMessage('sendMessage')
	async onMessage(@MessageBody() message: SendMessageBody) {
		const msgService = new MessagesService()
		const response = await msgService.sendMessage(message)
		if (response.success) {
			this.server.emit('sendMessageResponse', response)
		}
	}

	@SubscribeMessage('getUserMessages')
	async getUserMessages(@MessageBody() { jwt, userId }: { jwt: string; userId: number }) {
		const msgService = new MessagesService()
		const response = await msgService.getUserMessages(jwt, userId)
		if (response.success) {
			this.server.emit('allMessages', response)
		}
	}

	@SubscribeMessage('getGroupMessages')
	async getGroupMessages(@MessageBody() { jwt, groupId }: { jwt: string; groupId: string }) {
		const msgService = new MessagesService()
		const response = await msgService.getGroupMessages(jwt, groupId)
		if (response.success) {
			this.server.emit('allMessages', response)
		}
	}
}
