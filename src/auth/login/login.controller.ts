import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common'
import { LoginService } from './login.service'
import * as JWT from 'jsonwebtoken'
import { Request, Response } from 'express'
import { UserPublicData } from '../../types/userShowableData'
import getUserWithJwt from '../../getUsers/getUserWithJwt'
import { GetUserWithCredentialsErrorMessages, LoginRequestBody } from '../../types/login'
import { ErrorMessage, SuccessMessage } from '../../types/Messages'

@Controller('/login')
export class LoginController {
	constructor(private readonly loginService: LoginService) {}

	@Get()
	async checkAuth(@Req() req: Request) {
		const { jwt } = req.cookies
		return await getUserWithJwt(jwt)
	}

	@Post()
	async loginWithCredentials(@Body() requestBody: LoginRequestBody, @Res({ passthrough: true }) res: Response) {
		const response = await this.loginService.getUserWithCredentials(requestBody)

		if (!response.success) {
			return response as ErrorMessage<GetUserWithCredentialsErrorMessages>
		}

		const jwt = JWT.sign({ id: response.payload.user.id }, process.env.SECRET, { expiresIn: '30d' })
		res.cookie('jwt', jwt)
		return response as SuccessMessage<'Authorized', { user: UserPublicData }>
	}
}
