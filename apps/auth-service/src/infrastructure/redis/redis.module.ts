import { Global, Module } from '@nestjs/common';

import { LOGIN_ATTEMPT_STORE } from '@/common/constants/authentication.constants';

import { RedisLoginAttemptStore } from './authentication/login-attempt.store';
import { RedisService } from './redis.service';

@Global()
@Module({
  providers: [
    RedisService,
    {
      provide: LOGIN_ATTEMPT_STORE,
      useClass: RedisLoginAttemptStore,
    },
  ],
  exports: [
    RedisService,
    {
      provide: LOGIN_ATTEMPT_STORE,
      useClass: RedisLoginAttemptStore,
    },
  ],
})
export class RedisModule {}
