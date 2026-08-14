import { Global, Module } from '@nestjs/common';

import { RedisLoginAttemptStore } from './authentication/login-attempt.store';
import { RedisService } from './redis.service';

@Global()
@Module({
  providers: [RedisService, RedisLoginAttemptStore],
  exports: [RedisService, RedisLoginAttemptStore],
})
export class RedisModule {}
