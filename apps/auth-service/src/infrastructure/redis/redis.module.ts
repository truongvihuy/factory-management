import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

import { RedisService } from './redis.service';
import { CACHE } from './redis.token';

@Global()
@Module({
  providers: [
    RedisService,
    {
      provide: CACHE,
      useFactory: (configService: ConfigService) => {
        const connectionString = configService.getOrThrow<string>('redis.url');
        return new Redis(connectionString);
      },
      inject: [ConfigService],
    },
  ],
  exports: [RedisService],
})
export class RedisModule {}
