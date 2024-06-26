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
}
