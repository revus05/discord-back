import { Body, Controller, Get, Post, Req } from '@nestjs/common'
import { GetGroupsResponse, GroupService } from './group.service'
import getIdWithJwt from '../../utils/getIdWithJwt'
import { Request } from 'express'
import { AddUserToGroupRequestBody } from '../../types/group'

@Controller('/group')
export class GroupControllers {
	constructor(private readonly groupService: GroupService) {}

	@Get('/get')
	async getUserGroups(@Req() req: Request): Promise<GetGroupsResponse> {
		return await this.groupService.getGroups(req.cookies.jwt)
	}

	@Post('/addUser')
	async addUserToGroup(@Req() req: Request, @Body() requestBody: AddUserToGroupRequestBody) {
		return await this.groupService.addUserToGroup(req.cookies.jwt, requestBody)
	}
}
