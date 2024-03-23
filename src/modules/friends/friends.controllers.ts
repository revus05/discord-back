import { Controller, Get, Param, Post, Req } from '@nestjs/common'
import { Request } from 'express'
import { GetFriendsResponse, RemoveFriendResponse } from '../../types/friends'
import { FriendsService } from './friends.service'

@Controller('/friends')
export class FriendsControllers {
	constructor(private readonly friendsService: FriendsService) {}

	@Get('/get')
	async getFriends(@Req() req: Request): Promise<GetFriendsResponse> {
		return await this.friendsService.getFriends(req.cookies.jwt)
	}

	@Post('/remove/:userId')
	async removeFriend(@Req() req: Request, @Param('userId') userId: number): Promise<RemoveFriendResponse> {
		return await this.friendsService.removeFriend(req.cookies.jwt, userId)
	}
}
