import { Body, Controller, Post, Req } from '@nestjs/common'
import { UpdateUsernameResponse, UpdateUserResponse, UserService } from './user.service'
import { Request } from 'express'
import { UpdateDisplayName, UpdateUsernameRequestData } from '../types/userShowableData'

@Controller('/user')
export class userController {
	constructor(private readonly userService: UserService) {}

	@Post('updateDisplayName')
	async updateUserDisplayName(
		@Req() req: Request,
		@Body() requestBody: UpdateDisplayName,
	): Promise<UpdateUserResponse> {
		return await this.userService.updateUserDisplayName(req.cookies.jwt, requestBody)
	}

	@Post('updateUsername')
	async updateUsername(
		@Req() req: Request,
		@Body() requestBody: UpdateUsernameRequestData,
	): Promise<UpdateUsernameResponse> {
		return await this.userService.updateUsername(req.cookies.jwt, requestBody)
	}
}
