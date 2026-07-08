import { FactoryProvider, Provider } from '@nestjs/common';
import Redis, { RedisOptions } from 'ioredis';
import { REDIS_CLIENT } from '../redis.constants';

export const redisProvider = (options: RedisOptions, inject?: FactoryProvider['inject']): Provider => ({
  provide: REDIS_CLIENT,
  useFactory: () => {
    return new Redis(options);
  },
  inject,
});

export const redisFactoryProvider = (
  useFactory: (...args: any[]) => Promise<RedisOptions> | RedisOptions,
  inject?: FactoryProvider['inject'],
): Provider => ({
  provide: REDIS_CLIENT,
  useFactory: async (...args) => {
    const options = await useFactory(...args);
    return new Redis(options);
  },
  inject,
});
