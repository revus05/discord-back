import { User } from '@prisma/client'

export type UserPublicData = Omit<User, 'password'>

export type GetUsersWithJwtErrorMessages = 'Unauthorized' | 'No user with your data'

export type GetUserWithIdErrorMessages = 'No user found error'
