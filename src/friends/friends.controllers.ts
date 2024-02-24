import { Controller, Get, Post, Req } from '@nestjs/common'
import getIdWithJwt from '../logic/getIdWithJwt'
import { Request } from 'express'
import { FriendsService } from './friends.service'

@Controller('/friends')
export class FriendsControllers {
	constructor(private readonly friendsService: FriendsService) {}

	@Get('/get')
	async getGroups(@Req() req: Request) {
		const { jwt } = req.cookies
		const response = getIdWithJwt(jwt)
		if (!response.success) {
			return response
		}
		const id = response.payload.id
		return await this.friendsService.getFriends(id)
	}

	@Post('/add')
	async createGroup(@Req() req: Request) {
		const { jwt } = req.cookies
		const response = getIdWithJwt(jwt)
		if (!response.success) {
			return response
		}
		const id = response.payload.id
		return await this.friendsService.addFriend(id, req.body)
	}
}
