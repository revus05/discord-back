import { Controller, Get, Post, Req } from '@nestjs/common'
import { FriendsRequestService } from './friendsRequest.service'
import { Request } from 'express'
import getIdWithJwt from '../utils/getIdWithJwt'

@Controller('/friendsRequest')
export class FriendsRequestController {
	constructor(private readonly FriendsRequestService: FriendsRequestService) {}

	@Get('/get')
	async getFriendRequests(@Req() req: Request) {
		const { jwt } = req.cookies
		const response = getIdWithJwt(jwt)
		if (!response.success) {
			return response
		}
		const id = response.payload.id
		return await this.FriendsRequestService.getFriendRequests(id)
	}

	@Post('/accept')
	async acceptRequest(@Req() req: Request) {
		const { jwt } = req.cookies
		const response = getIdWithJwt(jwt)
		if (!response.success) {
			return response
		}
		const id = response.payload.id
		return await this.FriendsRequestService.acceptRequest(id, req.body)
	}

	@Post('/send')
	async addFriend(@Req() req: Request) {
		const { jwt } = req.cookies
		const response = getIdWithJwt(jwt)
		if (!response.success) {
			return response
		}
		const id = response.payload.id
		return await this.FriendsRequestService.sendRequest(id, req.body)
	}
}
