import { Module } from '@nestjs/common'
import { FriendsRequestService } from './friendsRequest.service'
import { FriendsRequestController } from './friendsRequest.controller'

@Module({
	providers: [FriendsRequestService],
	controllers: [FriendsRequestController],
})
export class FriendsRequestModule {}
