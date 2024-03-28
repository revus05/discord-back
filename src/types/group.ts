import { Group, UserGroup } from '@prisma/client'
import { ErrorMessage, SuccessMessage } from './responseMessages'

type AddUserToGroupErrorMessages = 'Unauthorized' | 'Error no group' | 'Error adding new user'

type GetGroupsErrorMessages = 'Unauthorized'

export type GroupWithParticipants = Group & {
	members: number
}

export type AddUserToGroupRequestBody = { userId: number; groupId?: number }

type LeaveFromGroupErrorMessages =
	| 'Unauthorized'
	| 'No group found for this id'
	| 'No user with this id found in this group'

export type GetGroupsResponse =
	| SuccessMessage<'Successfully got groups', { groups: GroupWithParticipants[] }>
	| ErrorMessage<GetGroupsErrorMessages>

export type CreateGroupResponse =
	| SuccessMessage<'Group created successfully', { group: Group; link: UserGroup }>
	| ErrorMessage<'Unable to create chat'>

export type AddUserToGroupResponse =
	| SuccessMessage<'User successfully added', { group: Group }>
	| ErrorMessage<AddUserToGroupErrorMessages>

export type LeaveFromGroupResponse =
	| SuccessMessage<'Successfully left group', { group: Group }>
	| ErrorMessage<LeaveFromGroupErrorMessages>
