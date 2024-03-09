import { User } from '@prisma/client'

export type UserWithoutPassword = Omit<User, 'password'>

export type UserShowableData = Omit<User, 'email' | 'password' | 'phoneNumber' | 'updatedAt'>

export type GetUsersWithJwtErrorMessages = 'Unauthorized'

export type GetUserWithIdErrorMessages = 'No user found error'

export type UpdateUserErrorMessages = 'Unauthorized'

export type UpdateUsernameErrorMessages = 'Unauthorized' | 'Wrong password'
