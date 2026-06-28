import { ModuleInject } from '@libs/common';
import { Provider } from '@nestjs/common';
import Redis, { RedisOptions } from 'ioredis';
import { REDIS_CLIENT } from '../redis.constants';

export const redisProvider = (options: RedisOptions, inject?: ModuleInject[]): Provider => ({
  provide: REDIS_CLIENT,
  useFactory: () => {
    return new Redis(options);
  },
  inject,
});

export const redisFactoryProvider = (
  useFactory: (...args: any[]) => RedisOptions,
  inject?: ModuleInject[],
): Provider => ({
  provide: REDIS_CLIENT,
  useFactory(...args) {
    const options = useFactory(...args);
    return new Redis(options);
  },
  inject,
});
