import { Module } from '@nestjs/common'
import { AuthModule } from '../auth/auth.module'
import { GroupModule } from '../group/group.module'
import { FriendsModule } from '../friends/friends.module'
import { UserModule } from '../user/user.module'
import { FriendsRequestModule } from '../friendsRequest/friendsRequest.module'

@Module({
	imports: [AuthModule, GroupModule, FriendsModule, UserModule, FriendsRequestModule],
})
export class AppModule {}
