import { Body, Controller, Post, Req } from '@nestjs/common'
import { UpdateUsernameResponse, UpdateUserResponse, UserService } from './user.service'
import { Request } from 'express'

@Controller('/user')
export class userController {
	constructor(private readonly userService: UserService) {}

	@Post('updateDisplayName')
	async updateUserDisplayName(
		@Req() req: Request,
		@Body() requestBody: { displayName: string },
	): Promise<UpdateUserResponse> {
		return await this.userService.updateUserDisplayName(req.cookies.jwt, requestBody)
	}

	@Post('updateUsername')
	async updateUsername(
		@Req() req: Request,
		@Body() requestBody: { username: string; password: string },
	): Promise<UpdateUsernameResponse> {
		return await this.userService.updateUsername(req.cookies.jwt, requestBody)
	}
}
