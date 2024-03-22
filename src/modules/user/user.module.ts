import { Module } from '@nestjs/common'
import { userController } from './user.controller'
import { UserService } from './user.service'
import { MulterModule } from '@nestjs/platform-express'

@Module({
	imports: [
		MulterModule.register({
			dest: `${process.cwd()}/public/avatars`,
		}),
	],
	controllers: [userController],
	providers: [UserService],
})
export class UserModule {}
