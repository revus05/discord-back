import { Module } from '@nestjs/common'
import { AuthModule } from '../modules/auth/auth.module'
import { GroupModule } from '../modules/group/group.module'
import { FriendsModule } from '../modules/friends/friends.module'
import { UserModule } from '../modules/user/user.module'
import { FriendsRequestModule } from '../modules/friendsRequest/friendsRequest.module'
import { GatewayModule } from '../dateway/gateway.module'

@Module({
	imports: [AuthModule, GroupModule, FriendsModule, UserModule, FriendsRequestModule, GatewayModule],
})
export class AppModule {}
