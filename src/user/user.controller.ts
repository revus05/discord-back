import { Controller, Post, Req } from '@nestjs/common'
import { UserService } from './user.service'
import getIdWithJwt from '../logic/getIdWithJwt'
import { Request } from 'express'

@Controller('/user')
export class userController {
	constructor(private readonly userService: UserService) {}

	@Post('update')
	async updateUser(@Req() req: Request) {
		const { jwt } = req.cookies
		const response = getIdWithJwt(jwt)
		if (!response.success) {
			return response
		}
		const id = response.payload.id
		console.log('req.body', req.body)
		return await this.userService.updateUser(id, req.body)
	}
}
