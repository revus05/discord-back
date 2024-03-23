import { Body, Controller, Post, Req, UploadedFile, UseInterceptors } from '@nestjs/common'
import {
	UpdatePhoneNumberResponse,
	UpdateUsernameResponse,
	UpdateUserResponse,
	UploadUserImageResponse,
	UserService,
} from './user.service'
import { Request } from 'express'
import {
	UpdateDisplayNameRequestData,
	UpdatePhoneNumberRequestData,
	UpdateUsernameRequestData,
} from '../../types/userShowableData'
import { FileInterceptor } from '@nestjs/platform-express'

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
