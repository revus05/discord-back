import { Controller, Get, Post, Req } from '@nestjs/common'
import { GroupService } from './group.service'
import getIdWithJwt from '../logic/getIdWithJwt'
import { Request } from 'express'

@Controller('/group')
export class GroupControllers {
	constructor(private readonly groupService: GroupService) {}

	@Get('/get')
	async getGroups(@Req() req: Request) {
		const { jwt } = req.cookies
		const response = getIdWithJwt(jwt)
		if (!response.success) {
			return response
		}
		const id = response.payload.id
		return await this.groupService.getGroups(id)
	}

	@Post('/addUser')
	async addUserToGroup(@Req() req: Request) {
		const { jwt } = req.cookies
		const response = getIdWithJwt(jwt)
		if (!response.success) {
			return response
		}
		const id = response.payload.id
		return await this.groupService.addUserToGroup(id, req.body)
	}
}
