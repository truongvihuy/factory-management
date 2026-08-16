import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { authRedisKeys } from '@/infrastructure/redis/keys/auth-redis.keys';
import { RedisService } from '@/infrastructure/redis/redis.service';

import { LoginAttemptStorePort } from '../../application/ports/login-attempt-store.port';

@Injectable()
export class RedisLoginAttemptStore implements LoginAttemptStorePort {
  constructor(
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
  ) {}

  private get failureWindowSeconds(): number {
    return this.configService.getOrThrow<number>('authentication.security.failureWindowSeconds');
  }

  async getFailedAttempts(userId: string): Promise<number> {
    const key = authRedisKeys.failedLoginAttempts(userId);

    const value = await this.redisService.get(key);

    if (value === null) {
      return 0;
    }

    return Number(value);
  }

  async incrementFailedAttempts(userId: string): Promise<number> {
    const key = authRedisKeys.failedLoginAttempts(userId);

    const attempts = await this.redisService.increment(key);

    if (attempts === 1) {
      await this.redisService.expire(key, this.failureWindowSeconds);
    }

    return attempts;
  }

  async resetFailedAttempts(userId: string): Promise<void> {
    const key = authRedisKeys.failedLoginAttempts(userId);

    await this.redisService.delete(key);
  }

  async getTtl(userId: string): Promise<number> {
    const key = authRedisKeys.failedLoginAttempts(userId);

    return this.redisService.ttl(key);
  }
}
