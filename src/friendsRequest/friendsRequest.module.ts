import { Module } from '@nestjs/common'
import { FriendsRequestService } from './friendsRequest.service'
import { FriendsRequestController } from './friendsRequestController'

@Module({
	providers: [FriendsRequestService],
	controllers: [FriendsRequestController],
})
export class FriendsRequestModule {}
