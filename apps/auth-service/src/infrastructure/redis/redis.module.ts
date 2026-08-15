import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

import { CACHE, LOGIN_ATTEMPT_STORE } from '@/common/constants/authentication.constants';

import { RedisLoginAttemptStore } from './authentication/redis-login-attempt.store';
import { RedisService } from './redis.service';

@Global()
@Module({
  providers: [
    RedisService,
    {
      provide: LOGIN_ATTEMPT_STORE,
      useClass: RedisLoginAttemptStore,
    },
    {
      provide: CACHE,
      useFactory: (configService: ConfigService) => {
        const connectionString = configService.getOrThrow<string>('redis.url');
        return new Redis(connectionString);
      },
      inject: [ConfigService],
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
