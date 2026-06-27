import { DynamicModule, InjectionToken, Module, OptionalFactoryDependency } from '@nestjs/common';
import { RedisOptions } from 'ioredis';
import { REDIS_CLIENT, REDIS_OPTIONS } from './redis.constants';
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

  static forRootAsync(options: {
    isGlobal: boolean;
    useFactory: (...array: any[]) => any;
    inject: (InjectionToken | OptionalFactoryDependency)[];
  }): DynamicModule {
    return {
      module: RedisModule,
      global: options.isGlobal || false,
      providers: [
        {
          provide: REDIS_CLIENT,
          useFactory: options.useFactory,
          inject: options.inject ?? [],
        },
        RedisService,
      ],
      exports: [RedisService],
    };
  }
}
