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
import { Chat, Group, User, UserGroup } from '@prisma/client'
import { ChatWithParticipants } from '../../types/chats'

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
				const groups: (Group & { chat: ChatWithParticipants })[] = await prisma.group.findMany({
					where: {
						id: userGroups[i].groupId,
					},
					include: {
						chat: {
							include: {
								participants: true,
							},
						},
					},
				})

				// converting to proper type
				groups.forEach(
					(
						g: Group & {
							chat: Chat & {
								participants: User[]
							}
						},
					) => {
						const groupWithMembers: GroupWithParticipants = {
							id: g.id,
							name: g.name,
							image: g.image,
							color: g.color,
							members: g.chat.participants.length,
							chatId: g.chatId,
							ownerId: g.ownerId,
							createdAt: g.createdAt,
							updatedAt: g.updatedAt,
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
		let group: Group & { chat: ChatWithParticipants }

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
				include: {
					chat: {
						include: {
							participants: true,
						},
					},
				},
			})

			if (group) {
				const addFriend: User = await prisma.user.findFirst({
					where: {
						id: data.userId,
					},
				})
				// updating group name
				await prisma.group.update({
					where: {
						id: group.id,
					},
					data: {
						name: `${group.name}, ${addFriend.displayName}`,
					},
				})
				// adding user to chat
				await prisma.chat.update({
					where: {
						id: group.chatId,
					},
					data: {
						participants: {
							connect: {
								id: data.userId,
							},
						},
					},
				})
			}
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
			// getting user that we want to add
			const addedUser = await prisma.user.findFirst({
				where: {
					id: userId,
				},
				select: {
					displayName: true,
				},
			})

			// creating chat and connecting addedUser to it
			const chat: Chat = await prisma.chat.create({
				data: {
					participants: {
						connect: [
							{
								id,
							},
							{
								id: userId,
							},
						],
					},
				},
			})

			if (!chat) {
				return {
					success: false,
					message: 'Unable to create chat',
				}
			}

			// creating group
			const group: Group & { chat: ChatWithParticipants } = await prisma.group.create({
				data: {
					color: generateNoImageColor(),
					name: name + `, ${addedUser.displayName}`,
					image: null,
					chat: {
						connect: {
							id: chat.id,
						},
					},
					ownerId: id,
				},
				include: {
					chat: {
						include: {
							participants: true,
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
