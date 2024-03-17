import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { OnModuleInit } from '@nestjs/common'
import * as console from 'console'
import { Server } from 'socket.io'
import { MessagesService } from './messages.service'

export type MessageBody = {
	text: string
	jwt: string
	receiverId: number
}

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
	async onMessage(@MessageBody() message: any) {
		const msgService = new MessagesService()
		const response = await msgService.addMessage(message)
		this.server.emit('resp', {
			message: response.payload.message,
		})
	}

	@SubscribeMessage('getMessages')
	async getMessages() {
		const msgService = new MessagesService()
		const response = await msgService.getMessages()
		this.server.emit('allMessages', response.payload.messages)
	}
}
