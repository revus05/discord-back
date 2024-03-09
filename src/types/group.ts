import { Group, UserGroup } from '@prisma/client'

export type AddUserToGroupErrorMessages = 'Unauthorized' | 'Error no group' | 'Error adding new user'

export type GetGroupsErrorMessages = 'Unauthorized'

export type GroupWithMembers = Group & {
	members: number
}

export type GroupWithUsers = Group & {
	users: UserGroup[]
}

export type UserGroupWithGroup = UserGroup & {
	group: Group
}

export type AddUserToGroupRequestBody = { userId: number; groupId?: number }
