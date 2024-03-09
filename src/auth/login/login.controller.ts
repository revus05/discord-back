import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common'
import { LoginWithCredentials, LoginService } from './login.service'
import { Request, Response } from 'express'
import getUserWithJwt, { GetUserWithJwtResponse } from '../../getUsers/getUserWithJwt'
import { LoginRequestBody } from '../../types/login'

@Controller('/login')
export class LoginController {
	constructor(private readonly loginService: LoginService) {}

	@Get('/jwt')
	async loginWithJwt(@Req() req: Request): Promise<GetUserWithJwtResponse> {
		return await getUserWithJwt(req.cookies)
	}

	@Post('/credentials')
	async loginWithCredentials(
		@Body() requestBody: LoginRequestBody,
		@Res({ passthrough: true }) res: Response,
	): Promise<LoginWithCredentials> {
		const response = await this.loginService.loginWithCredentials(requestBody)
		if (!response.success) {
			return response
		}
		res.cookie('jwt', response.payload.jwt)
		return response
	}
}
