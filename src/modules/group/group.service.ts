import { Injectable } from '@nestjs/common'
import prisma from '../../../prisma/client'
import { Group, UserGroup } from '@prisma/client'
import { ErrorMessage, SuccessMessage } from '../../types/messages'
import getUserWithJwt from '../../getUsers/getUserWithJwt'
import {
	AddUserToGroupErrorMessages,
	AddUserToGroupRequestBody,
	GetGroupsErrorMessages,
	GroupWithMembers,
	GroupWithUsers,
} from '../../types/group'
import generateNoImageColor from '../../utils/generateNoImageColor'

export type GetGroupsResponse =
	| SuccessMessage<'Successfully got groups', { groups: GroupWithMembers[] }>
	| ErrorMessage<GetGroupsErrorMessages>

type CreateGroupResponse =
	| SuccessMessage<'Group created successfully', { group: Group; link: UserGroup }>
	| ErrorMessage<''>

type AddUserToGroupResponse =
	| SuccessMessage<'User successfully added', { group: Group }>
	| ErrorMessage<AddUserToGroupErrorMessages>

@Injectable()
export class GroupService {
	async getGroups(jwt: string): Promise<GetGroupsResponse> {
		try {
			const response = await getUserWithJwt(jwt, { groups: true })
			if (!response.success) {
				return {
					success: false,
					message: 'Unauthorized',
				}
			}
			const user = response.payload.user

			const userGroups: UserGroup[] = user.groups

			// creating array for groups with members
			let groupsWithMembers: GroupWithMembers[] = []
			for (let i = 0; i < userGroups.length; i++) {
				const groups: GroupWithUsers[] = await prisma.group.findMany({
					where: {
						id: userGroups[i].groupId,
					},
					include: {
						users: true,
					},
				})

				groups.forEach((g: Group & { users: UserGroup[] }) => {
					const groupWithMembers: GroupWithMembers = {
						id: g.id,
						name: g.name,
						image: g.image,
						color: g.color,
						members: g.users.length,
						createdAt: g.createdAt,
						updatedAt: g.updatedAt,
					}
					groupsWithMembers.push(groupWithMembers)
				})
			}

			return {
				success: true,
				message: 'Successfully got groups',
				payload: {
					groups: groupsWithMembers,
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

	async addUserToGroup(jwt: string, data: AddUserToGroupRequestBody): Promise<AddUserToGroupResponse> {
		// getting user and his groups
		const response = await getUserWithJwt(jwt, {
			groups: true,
		})
		if (!response.success) {
			return {
				success: false,
				message: 'Unauthorized',
			}
		}
		const user = response.payload.user
		const id = user.id
		console.log(user.groups)
		const groups: UserGroup[] = user.groups
		let groupId: number
		let group: Group
		// checking if the group to add to exists
		if (data.groupId) {
			const foundGroup: UserGroup = groups.find((group: UserGroup) => {
				return group.groupId === data.groupId
			})
			groupId = foundGroup.groupId
			// if exists, getting it
			group = await prisma.group.findFirst({
				where: {
					id: groupId,
				},
			})
		}

		// if group to add doesn't exist, creating it
		if (!group) {
			const response = await this.createGroup(id, data.userId, user.displayName)
			if (response.success) {
				group = response.payload.group
			}
		}
		// creating link to connect user and group
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
			payload: {
				group,
			},
		}
	}

	async createGroup(id: number, userId: number, name: string): Promise<CreateGroupResponse> {
		try {
			const addedUser = await prisma.user.findFirst({
				where: {
					id: userId,
				},
				select: {
					displayName: true,
				},
			})
			// creating group
			const group: Group = await prisma.group.create({
				data: {
					color: generateNoImageColor(),
					name: name + ` ${addedUser.displayName}`,
					image: null,
				},
			})

			// creating link to connect users in group
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
}
