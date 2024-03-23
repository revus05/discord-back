import { Body, Controller, Post } from '@nestjs/common'
import { RegisterCredentials, RegisterResponse } from '../../../types/register'
import { RegisterService } from './register.service'

@Controller('/register')
export class RegisterController {
	constructor(private readonly registerService: RegisterService) {}

	@Post()
	async register(@Body() requestBody: RegisterCredentials): Promise<RegisterResponse> {
		return await this.registerService.register(requestBody)
	}
}
