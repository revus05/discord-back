import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from '../auth/auth.module'
import { GroupModule } from '../group/group.module'
import { FriendsModule } from '../friends/friends.module'

@Module({
	imports: [AuthModule, GroupModule, FriendsModule],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
