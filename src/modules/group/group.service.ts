import getUserWithJwt from '../../getUsers/getUserWithJwt'
import prisma from '../../../prisma/client'
import generateNoImageColor from '../../utils/generateNoImageColor'
import {
	AddUserToGroupRequestBody,
	AddUserToGroupResponse,
	CreateGroupResponse,
	GetGroupsResponse,
	GroupWithParticipants,
	LeaveFromGroupResponse,
} from '../../types/group'
import { Injectable } from '@nestjs/common'
import { Chat, Group, UserChat, UserGroup } from '@prisma/client'

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
			let groupsWithMembers: GroupWithParticipants[] = []
			for (let i = 0; i < userGroups.length; i++) {
				const groups: any = await prisma.group.findMany({
					where: {
						id: userGroups[i].groupId,
					},
					include: {
						chat: {
							include: {
								messages: true,
								userChat: true,
							},
						},
					},
				})

				groups.forEach(
					(
						g: Group & {
							chat: Chat & {
								userChat: UserChat[]
							}
						},
					) => {
						const groupWithMembers: GroupWithParticipants = {
							id: g.id,
							name: g.name,
							image: g.image,
							color: g.color,
							members: g.chat.userChat.length,
							createdAt: g.createdAt,
							updatedAt: g.updatedAt,
							chatId: g.chatId,
							chat: g.chat,
						}
						groupsWithMembers.push(groupWithMembers)
					},
				)
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

			const chat: Chat = await prisma.chat.create({
				data: {},
			})

			// creating group
			const group: Group = await prisma.group.create({
				data: {
					color: generateNoImageColor(),
					name: name + ` ${addedUser.displayName}`,
					image: null,
					chat: {
						connect: {
							id: chat.id,
						},
					},
				},
			})

			// creating link to connect users in group
			const link: UserGroup = await prisma.userGroup.create({
				data: {
					userId: id,
					groupId: group.id,
				},
			})

			const chatLink: any = await prisma.chat.update({
				where: {
					id: chat.id,
				},
				data: {
					userChat: {
						create: {
							user: {
								connect: {
									id: userId,
								},
							},
						},
					},
				},
				select: {
					userChat: true,
				},
			})

			const chatLink2: any = await prisma.chat.update({
				where: {
					id: chat.id,
				},
				data: {
					userChat: {
						create: {
							user: {
								connect: {
									id,
								},
							},
						},
					},
				},
				select: {
					userChat: true,
				},
			})

			if (!chatLink || chatLink2) {
				return {
					success: false,
					message: 'Unable to create chat',
				}
			}

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

	async leaveFromGroup(jwt: string, groupId: number): Promise<LeaveFromGroupResponse> {
		const response = await getUserWithJwt(jwt, {
			groups: true,
		})
		if (!response.success) {
			return {
				success: false,
				message: 'Unauthorized',
			}
		}
		const id = response.payload.user.id
		try {
			// check if the group exists
			const group: Group & { users: UserGroup[] } = await prisma.group.findFirst({
				where: {
					id: groupId,
				},
				include: {
					users: true,
				},
			})

			if (!group) {
				return {
					success: false,
					message: 'No group found for this id',
				}
			}

			// check if the user exists in this group
			const user: UserGroup | undefined = group.users.find((userGroup: UserGroup) => userGroup.userId === id)

			if (!user) {
				return {
					success: false,
					message: 'No user with this id found in this group',
				}
			}

			// delete record about user being in the group
			const updatedGroup: UserGroup & { group: Group } = await prisma.userGroup.delete({
				where: {
					userId_groupId: {
						userId: id,
						groupId: groupId,
					},
				},
				include: {
					group: true,
				},
			})

			return {
				success: true,
				message: 'Successfully left group',
				payload: {
					group: updatedGroup.group,
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
