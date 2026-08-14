import { Global, Module } from '@nestjs/common';

import { AuthenticationRedisService } from './authentication/authentication-redis.service';
import { RedisService } from './redis.service';

@Global()
@Module({
  providers: [RedisService, AuthenticationRedisService],
  exports: [RedisService, AuthenticationRedisService],
})
export class RedisModule {}
