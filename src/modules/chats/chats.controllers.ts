import { Controller, Get, Req } from '@nestjs/common'
import { ChatsService } from './chats.service'
import { Request } from 'express'
import { GetChatsResponse } from '../../types/chats'

@Controller('/chats')
export class ChatsControllers {
	constructor(private readonly chatsService: ChatsService) {}

	@Get('get')
	async getChats(@Req() req: Request): Promise<GetChatsResponse> {
		return await this.chatsService.getChats(req.cookies.jwt)
	}
}
