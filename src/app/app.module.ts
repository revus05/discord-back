import { Module } from '@nestjs/common'
import { AuthModule } from '../auth/auth.module'
import { GroupModule } from '../group/group.module'
import { FriendsModule } from '../friends/friends.module'
import { UserModule } from '../user/user.module'

@Module({
	imports: [AuthModule, GroupModule, FriendsModule, UserModule],
})
export class AppModule {}
