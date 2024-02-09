import { Body, Controller, Post } from '@nestjs/common'
import { RegisterResponse, RegisterService } from './register.service'
import * as bcrypt from 'bcryptjs'
import { RegisterRequestBody } from '../../types/register'

@Controller('/register')
export class RegisterController {
	constructor(private readonly registerService: RegisterService) {}

	@Post()
	async register(@Body() requestBody: RegisterRequestBody): Promise<RegisterResponse> {
		return await this.registerService.register({
			...requestBody,
			password: await bcrypt.hash(requestBody.password, await bcrypt.genSalt(16)),
		})
	}
}
