import { Body, Controller, Get, Post, Req } from '@nestjs/common'
import {
	AddFriendRequestResponse,
	DeleteFriendRequestResponse,
	FriendsRequestService,
	GetFriendRequestsResponse,
	SendFriendRequestResponse,
} from './friendsRequest.service'
import { Request } from 'express'
import {
	AcceptFriendRequestRequestBody,
	DeleteFriendRequestRequestBody,
	SendFriendRequestRequestBody,
} from '../../types/friends'

@Controller('/friendsRequest')
export class FriendsRequestController {
	constructor(private readonly FriendsRequestService: FriendsRequestService) {}

	@Get('/get')
	async getFriendRequests(@Req() req: Request): Promise<GetFriendRequestsResponse> {
		return await this.FriendsRequestService.getFriendRequests(req.cookies.jwt)
	}

	@Post('/accept')
	async acceptRequest(
		@Req() req: Request,
		@Body() requestBody: AcceptFriendRequestRequestBody,
	): Promise<AddFriendRequestResponse> {
		return await this.FriendsRequestService.acceptRequest(req.cookies.jwt, requestBody)
	}

	@Post('/send')
	async addFriendRequest(
		@Req() req: Request,
		@Body() requestBody: SendFriendRequestRequestBody,
	): Promise<SendFriendRequestResponse> {
		return await this.FriendsRequestService.sendRequest(req.cookies.jwt, requestBody)
	}

	@Post('/delete')
	async deleteFriendRequest(
		@Req() req: Request,
		@Body() requestBody: DeleteFriendRequestRequestBody,
	): Promise<DeleteFriendRequestResponse> {
		return await this.FriendsRequestService.deleteRequest(req.cookies.jwt, requestBody)
	}
}
