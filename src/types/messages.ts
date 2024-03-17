export type SendMessageBody = {
	text: string
	jwt: string
	receiverId: number
}

export type SendMessageErrorMessages = 'Unauthorized'

export type GetMessagesErrorMessages = 'Unauthorized'
