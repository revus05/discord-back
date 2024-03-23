import { Body, Controller, Post, Req, UploadedFile, UseInterceptors } from '@nestjs/common'

import { Request } from 'express'
import { FileInterceptor } from '@nestjs/platform-express'
import { UserService } from './user.service'
import {
	UpdateDisplayNameRequestData,
	UpdatePhoneNumberRequestData,
	UpdatePhoneNumberResponse,
	UpdateUsernameRequestData,
	UpdateUsernameResponse,
	UpdateUserResponse,
	UploadUserImageResponse,
} from '../../types/users'

@Controller('/user')
export class userController {
	constructor(private readonly userService: UserService) {}

	@Post('updateDisplayName')
	async updateUserDisplayName(
		@Req() req: Request,
		@Body() requestBody: UpdateDisplayNameRequestData,
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

	@Post('uploadUserImage')
	@UseInterceptors(FileInterceptor('file'))
	uploadUserImage(@Req() req: Request, @UploadedFile() file: Express.Multer.File): Promise<UploadUserImageResponse> {
		return this.userService.uploadUserImage(req.cookies.jwt, file)
	}

	@Post('updatePhoneNumber')
	async updatePhoneNumber(
		@Req() req: Request,
		@Body() requestBody: UpdatePhoneNumberRequestData,
	): Promise<UpdatePhoneNumberResponse> {
		return await this.userService.updatePhoneNumber(req.cookies.jwt, requestBody)
	}
}
