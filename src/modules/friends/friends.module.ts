import { Module } from '@nestjs/common'
import { FriendsControllers } from './friends.controllers'
import { FriendsService } from './friends.service'

@Module({
	controllers: [FriendsControllers],
	providers: [FriendsService],
})
export class FriendsModule {}
