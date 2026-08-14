import { Injectable } from '@nestjs/common';

import { authRedisKeys } from '../keys/auth-redis.keys';
import { RedisService } from '../redis.service';

@Injectable()
export class AuthenticationRedisService {
  private static readonly FAILED_LOGIN_TTL_SECONDS = 15 * 60;

  constructor(private readonly redisService: RedisService) {}

  async getFailedLoginAttempts(identifier: string): Promise<number> {
    const key = authRedisKeys.failedLoginAttempts(identifier);

    const value = await this.redisService.get(key);

    if (value === null) {
      return 0;
    }

    return Number(value);
  }

  async incrementFailedLoginAttempts(identifier: string): Promise<number> {
    const key = authRedisKeys.failedLoginAttempts(identifier);

    const attempts = await this.redisService.increment(key);

    if (attempts === 1) {
      await this.redisService.expire(key, AuthenticationRedisService.FAILED_LOGIN_TTL_SECONDS);
    }

    return attempts;
  }

  async resetFailedLoginAttempts(identifier: string): Promise<void> {
    const key = authRedisKeys.failedLoginAttempts(identifier);

    await this.redisService.delete(key);
  }

  async getFailedLoginAttemptsTtl(identifier: string): Promise<number> {
    const key = authRedisKeys.failedLoginAttempts(identifier);

    return this.redisService.ttl(key);
  }
}
