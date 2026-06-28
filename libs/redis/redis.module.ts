import { ModuleInject, ModuleOptions } from '@libs/common';
import { DynamicModule, Module } from '@nestjs/common';
import { RedisOptions } from 'ioredis';
import { redisFactoryProvider, redisProvider } from './providers/redis.provider';
import { REDIS_CLIENT } from './redis.constants';
import { RedisService } from './redis.service';

@Module({})
export class RedisModule {
  static forRoot(options: RedisOptions & ModuleOptions): DynamicModule {
    return {
      module: RedisModule,
      global: options.isGlobal || false,
      providers: [RedisService, redisProvider(options)],
      exports: [RedisService, REDIS_CLIENT],
    };
  }

  static forRootAsync(options: {
    isGlobal: boolean;
    useFactory: (...array: any[]) => RedisOptions;
    inject: ModuleInject[];
  }): DynamicModule {
    return {
      module: RedisModule,
      global: options.isGlobal || false,
      providers: [RedisService, redisFactoryProvider(options.useFactory, options.inject)],
      exports: [RedisService, REDIS_CLIENT],
    };
  }
}
