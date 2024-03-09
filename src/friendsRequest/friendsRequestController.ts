import { Body, Controller, Get, Post, Req } from '@nestjs/common'
import {
	AddFriendsResponse,
	FriendsRequestService,
	GetFriendRequestsResponse,
	SendFriendRequestResponse,
} from './friendsRequest.service'
import { Request } from 'express'

@Controller('/friendsRequest')
export class FriendsRequestController {
	constructor(private readonly FriendsRequestService: FriendsRequestService) {}

	@Get('/get')
	async getFriendRequests(@Req() req: Request): Promise<GetFriendRequestsResponse> {
		return await this.FriendsRequestService.getFriendRequests(req.cookies.jwt)
	}

	@Post('/accept')
	async acceptRequest(@Req() req: Request, @Body() requestBody: { requestId: number }): Promise<AddFriendsResponse> {
		return await this.FriendsRequestService.acceptRequest(req.cookies.jwt, requestBody)
	}

	@Post('/send')
	async addFriend(
		@Req() req: Request,
		@Body() requestBody: { username: string },
	): Promise<SendFriendRequestResponse> {
		return await this.FriendsRequestService.sendRequest(req.cookies.jwt, requestBody)
	}
}
