import { Module } from '@nestjs/common'
import { FriendsRequestService } from './friendsRequest.service'

@Module({
	providers: [FriendsRequestService],
	controllers: [],
})
export class FriendsRequestModule {}
