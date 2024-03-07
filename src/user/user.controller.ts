import { Controller, Post, Req } from '@nestjs/common'
import { UserService } from './user.service'
import getIdWithJwt from '../logic/getIdWithJwt'
import { Request } from 'express'

@Controller('/user')
export class userController {
	constructor(private readonly userService: UserService) {}

	@Post('updateDisplayName')
	async updateUserDisplayName(@Req() req: Request) {
		const { jwt } = req.cookies
		const response = getIdWithJwt(jwt)
		if (!response.success) {
			return response
		}
		const id = response.payload.id
		return await this.userService.updateUserDisplayName(id, req.body)
	}

	@Post('updateUsername')
	async updateUsername(@Req() req: Request) {
		const { jwt } = req.cookies
		const response = getIdWithJwt(jwt)
		if (!response.success) {
			return response
		}
		const id = response.payload.id
		return await this.userService.updateUsername(id, req.body)
	}
}
