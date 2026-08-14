import { Injectable } from '@nestjs/common';

import { RedisService } from '../redis/redis.service';
import type { CacheStore } from './interfaces/cache-store.interface';

@Injectable()
export class CacheService implements CacheStore {
  constructor(private readonly redisService: RedisService) {}

  async get<T>(key: string): Promise<T | null> {
    const value = await this.redisService.get(key);

    if (value === null) {
      return null;
    }

    return JSON.parse(value) as T;
  }

  async set<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    const serialized = JSON.stringify(value);

    await this.redisService.set(key, serialized, ttlSeconds);
  }

  async delete(key: string): Promise<void> {
    await this.redisService.delete(key);
  }

  async exists(key: string): Promise<boolean> {
    return this.redisService.exists(key);
  }
}
