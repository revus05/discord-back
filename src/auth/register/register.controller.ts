import { Body, Controller, Post } from '@nestjs/common'
import { RegisterResponse, RegisterService } from './register.service'
import { RegisterCredentials } from '../../types/register'

@Controller('/register')
export class RegisterController {
	constructor(private readonly registerService: RegisterService) {}

	@Post()
	async register(@Body() requestBody: RegisterCredentials): Promise<RegisterResponse> {
		return await this.registerService.register(requestBody)
	}
}
