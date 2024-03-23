import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common'
import { LoginService } from './login.service'
import { Request, Response } from 'express'
import getUserWithJwt, { GetUserWithJwtResponse } from '../../../getUsers/getUserWithJwt'
import { LoginCredentials, LoginWithCredentialsResponse } from '../../../types/login'

@Controller('/login')
export class LoginController {
	constructor(private readonly loginService: LoginService) {}

	@Get('/jwt')
	async loginWithJwt(@Req() req: Request): Promise<GetUserWithJwtResponse> {
		return await getUserWithJwt(req.cookies.jwt)
	}

	@Post('/credentials')
	async loginWithCredentials(
		@Body() requestBody: LoginCredentials,
		@Res({ passthrough: true }) res: Response,
	): Promise<LoginWithCredentialsResponse> {
		const response = await this.loginService.loginWithCredentials(requestBody)
		if (!response.success) {
			return response
		}
		res.cookie('jwt', response.payload.jwt)
		const { jwt, ...payloadWithoutJwt } = response.payload
		return { ...response, payload: payloadWithoutJwt }
	}
}
