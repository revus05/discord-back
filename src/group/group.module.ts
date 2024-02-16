import { Module } from '@nestjs/common'
import { GroupControllers } from './group.controllers'
import { GroupService } from './group.service'

@Module({
	controllers: [GroupControllers],
	providers: [GroupService],
})
export class GroupModule {}
