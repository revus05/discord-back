export type SendMessageBody = {
	text: string
	jwt: string
	receiverId?: number
	groupId?: string
}

export type SendMessageErrorMessages = 'Unauthorized'

export type GetUserMessagesErrorMessages = 'Unauthorized'

export type GetGroupMessagesErrorMessages = 'Unauthorized'
