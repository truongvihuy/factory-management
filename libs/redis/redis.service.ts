import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { REDIS_CLIENT } from './redis.constants';

@Injectable()
export class RedisService {
  constructor(
    @Inject(REDIS_CLIENT)
    private readonly redis: Redis,
  ) {}

  async set(key: string, value: any, ttl?: number) {
    if (ttl) {
      return this.redis.set(key, JSON.stringify(value), 'EX', ttl);
    }

    return this.redis.set(key, JSON.stringify(value));
  }

  async get<T>(key: string): Promise<T | null> {
    const data = await this.redis.get(key);

    if (!data) {
      return null;
    }

    return JSON.parse(data);
  }

  async del(key: string) {
    return this.redis.del(key);
  }

  async publish(channel: string, payload: any) {
    return this.redis.publish(channel, JSON.stringify(payload));
  }
}
