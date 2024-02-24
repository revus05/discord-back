import { Injectable } from '@nestjs/common'
import prisma from '../../prisma/client'
import { Group, NoImageColors, User, UserGroup } from '@prisma/client'
import { ErrorMessage, SuccessMessage } from '../types/Messages'

type GetGroups = SuccessMessage<'Successfully got groups', { groups: Group[] }> | ErrorMessage<'Unauthorized'>

type CreateGroupResponse =
	| SuccessMessage<'Group created successfully', { group: Group; link: UserGroup }>
	| ErrorMessage<''>

type AddUserToGroupResponse =
	| SuccessMessage<'User successfully added', undefined>
	| ErrorMessage<AddUserToGroupErrorMessages>

type UserGroupWithGroup = UserGroup & {
	group: Group
}

@Injectable()
export class GroupService {
	async getGroups(id: number): Promise<GetGroups> {
		const user: User & { groups: UserGroup[] } = await prisma.user.findFirst({
			where: {
				id,
			},
			include: {
				groups: true,
			},
		})
		if (!user) {
			return {
				success: false,
				message: 'Unauthorized',
			}
		}
		const userGroups: UserGroup[] = await prisma.userGroup.findMany({
			where: {
				userId: id,
			},
		})

		let groups: Group[] = []
		for (let i = 0; i < userGroups.length; i++) {
			groups.push(
				...(await prisma.group.findMany({
					where: {
						id: userGroups[i].groupId,
					},
				})),
			)
		}

		return {
			success: true,
			message: 'Successfully got groups',
			payload: {
				groups,
			},
		}
	}

	async createGroup(id: number): Promise<CreateGroupResponse> {
		const random = Math.floor(Math.random() * 5)
		let color: NoImageColors
		switch (random) {
			case 1:
				color = NoImageColors.orange
				break
			case 2:
				color = NoImageColors.red
				break
			case 3:
				color = NoImageColors.green
				break
			case 4:
				color = NoImageColors.blue
				break
			case 5:
				color = NoImageColors.yellow
				break
		}
		try {
			const group: Group = await prisma.group.create({
				data: {
					color,
					images: null,
				},
			})

			const link: UserGroup = await prisma.userGroup.create({
				data: {
					userId: id,
					groupId: group.id,
				},
			})
			return {
				success: true,
				message: 'Group created successfully',
				payload: {
					group,
					link,
				},
			}
		} catch (e) {
			console.log(e)
			return {
				success: false,
				message: 'Server error',
			}
		}
	}

	async addUserToGroup(id: number, data: { userId: number; groupId: number }): Promise<AddUserToGroupResponse> {
		const user: User & { groups: UserGroupWithGroup[] } = await prisma.user.findFirst({
			where: {
				id,
			},
			include: {
				groups: {
					include: {
						group: true,
					},
				},
			},
		})
		if (!user) {
			return {
				success: false,
				message: 'Unauthorized',
			}
		}
		const groups = user.groups
		const group: Group = groups.find(group => {
			return group.group.id === data.groupId
		}).group
		if (!group) {
			return {
				success: false,
				message: 'Error no group',
			}
		}
		const newUserInGroup: UserGroup = await prisma.userGroup.create({
			data: {
				userId: data.userId,
				groupId: group.id,
			},
		})
		if (!newUserInGroup) {
			return {
				success: false,
				message: 'Error adding new user',
			}
		}
		return {
			success: true,
			message: 'User successfully added',
		}
	}
}
