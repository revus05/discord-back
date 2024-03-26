import { Body, Controller, Delete, Get, Param, Post, Req } from '@nestjs/common'
import { GroupService } from './group.service'
import { Request } from 'express'
import {
	AddUserToGroupRequestBody,
	AddUserToGroupResponse,
	GetGroupsResponse,
	LeaveFromGroupResponse,
} from '../../types/group'

@Controller('/group')
export class GroupControllers {
	constructor(private readonly groupService: GroupService) {}

	@Get('/get')
	async getUserGroups(@Req() req: Request): Promise<GetGroupsResponse> {
		return await this.groupService.getGroups(req.cookies.jwt)
	}

	@Post('/addUser')
	async addUserToGroup(
		@Req() req: Request,
		@Body() requestBody: AddUserToGroupRequestBody,
	): Promise<AddUserToGroupResponse> {
		return await this.groupService.addUserToGroup(req.cookies.jwt, requestBody)
	}

	@Delete('/leave/:groupId')
	async leaveFromGroup(@Param('groupId') groupId: number, @Req() req: Request): Promise<LeaveFromGroupResponse> {
		return await this.groupService.leaveFromGroup(req.cookies.jwt, groupId)
	}
}
