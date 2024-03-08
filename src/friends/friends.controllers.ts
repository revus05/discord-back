import { Controller, Get, Post, Req } from '@nestjs/common'
import getIdWithJwt from '../logic/getIdWithJwt'
import { Request } from 'express'
import { FriendsService } from './friends.service'

@Controller('/friends')
export class FriendsControllers {
	constructor(private readonly friendsService: FriendsService) {}

	@Get('/get')
	async getFriends(@Req() req: Request) {
		const { jwt } = req.cookies
		const response = getIdWithJwt(jwt)
		if (!response.success) {
			return response
		}
		const id = response.payload.id
		return await this.friendsService.getFriends(id)
	}

	@Post('/sendFriendRequest')
	async addFriend(@Req() req: Request) {
		const { jwt } = req.cookies
		const response = getIdWithJwt(jwt)
		if (!response.success) {
			return response
		}
		const id = response.payload.id
		return await this.friendsService.sendRequest(id, req.body)
	}

	@Get('/getFriendRequests')
	async getFriendRequests(@Req() req: Request) {
		const { jwt } = req.cookies
		const response = getIdWithJwt(jwt)
		if (!response.success) {
			return response
		}
		const id = response.payload.id
		return await this.friendsService.getFriendRequests(id)
	}

	@Post('/acceptRequest')
	async acceptRequest(@Req() req: Request) {
		const { jwt } = req.cookies
		const response = getIdWithJwt(jwt)
		if (!response.success) {
			return response
		}
		const id = response.payload.id
		return await this.friendsService.acceptRequest(id, req.body)
	}

	@Post('/removeFriend')
	async removeFriend(@Req() req: Request) {
		const { jwt } = req.cookies
		const response = getIdWithJwt(jwt)
		if (!response.success) {
			return response
		}
		const id = response.payload.id
		return await this.friendsService.removeFriend(id, req.body)
	}
}
