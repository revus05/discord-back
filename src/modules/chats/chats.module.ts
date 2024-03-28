import { Module } from '@nestjs/common'
import { ChatsControllers } from './chats.controllers'
import { ChatsService } from './chats.service'

@Module({
	controllers: [ChatsControllers],
	providers: [ChatsService],
})
export class ChatsModule {}
