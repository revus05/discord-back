import { Module } from '@nestjs/common'
import { MyGateway } from './gateway'
import { MessagesService } from './messages.service'

@Module({
	providers: [MyGateway, MessagesService],
})
export class GatewayModule {}
