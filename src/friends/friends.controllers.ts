import { Controller, Get, Post, Req } from '@nestjs/common'
import { Request } from 'express'
import { FriendsService, GetFriendsResponse, RemoveFriendResponse } from './friends.service'

@Controller('/friends')
export class FriendsControllers {
	constructor(private readonly friendsService: FriendsService) {}

	@Get('/get')
	async getFriends(@Req() req: Request): Promise<GetFriendsResponse> {
		return await this.friendsService.getFriends(req.cookies.jwt)
	}

	@Post('/remove')
	async removeFriend(@Req() req: Request): Promise<RemoveFriendResponse> {
		return await this.friendsService.removeFriend(req.cookies.jwt, req.body)
	}
}
