import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

import type { RedisStore } from './interfaces/redis-store.interface';

@Injectable()
export class RedisService implements RedisStore, OnModuleInit, OnModuleDestroy {
  private client: Redis;

  constructor(readonly configService: ConfigService) {
    const connectionString = configService.getOrThrow<string>('redis.url');
    this.client = new Redis(connectionString);
  }

  async onModuleInit(): Promise<void> {
    await this.client.ping();
  }

  async onModuleDestroy(): Promise<void> {
    await this.client.quit();
  }

  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<'OK' | null> {
    if (ttlSeconds !== undefined) {
      return this.client.set(key, value, 'EX', ttlSeconds);
    }

    return this.client.set(key, value);
  }

  async increment(key: string): Promise<number> {
    return this.client.incr(key);
  }

  async delete(key: string): Promise<number> {
    return this.client.del(key);
  }

  async exists(key: string): Promise<boolean> {
    const result = await this.client.exists(key);

    return result === 1;
  }

  async expire(key: string, ttlSeconds: number): Promise<boolean> {
    const result = await this.client.expire(key, ttlSeconds);

    return result === 1;
  }

  async ttl(key: string): Promise<number> {
    return this.client.ttl(key);
  }

  async ping(): Promise<string> {
    return this.client.ping();
  }
}
