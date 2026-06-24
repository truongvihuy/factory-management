import { Module } from '@nestjs/common';

import { RedisModule } from '../redis/redis.module';
import { WsGateway } from './ws.gateway';
import { WsService } from './ws.service';

@Module({
  imports: [RedisModule],
  providers: [WsGateway, WsService],
})
export class WsModule {}
