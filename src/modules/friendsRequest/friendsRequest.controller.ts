import { Body, Controller, Delete, Get, Param, Post, Req } from '@nestjs/common'
import { Request } from 'express'
import { AcceptFriendRequestRequestBody, SendFriendRequestRequestBody } from '../../types/friends'
import {
	AddFriendRequestResponse,
	DeleteFriendRequestResponse,
	GetFriendRequestsResponse,
	SendFriendRequestResponse,
} from '../../types/friendRequests'
import { FriendsRequestService } from './friendsRequest.service'

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

	@Delete('/delete/:requestId')
	async deleteFriendRequest(
		@Req() req: Request,
		@Param('requestId') requestId: number,
	): Promise<DeleteFriendRequestResponse> {
		return await this.FriendsRequestService.deleteRequest(req.cookies.jwt, requestId)
	}
}
