import { DynamicModule, Module } from '@nestjs/common';
import { RedisOptions } from 'ioredis';
import { REDIS_OPTIONS } from './redis.constants';
import { RedisService } from './redis.service';

@Module({})
export class RedisModule {
  static forRoot(options: RedisOptions & { isGlobal?: boolean }): DynamicModule {
    return {
      module: RedisModule,
      global: options.isGlobal || false,
      providers: [
        {
          provide: REDIS_OPTIONS,
          useValue: options,
        },
        RedisService,
      ],
      exports: [RedisService],
    };
  }
}
