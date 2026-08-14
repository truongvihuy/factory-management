import { Injectable } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import { authRedisKeys } from '../keys/auth-redis.keys';
import { RedisService } from '../redis.service';

@Injectable()
export class AuthenticationRedisService {
  constructor(
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
  ) {}

  private get failureWindowMinutes(): number {
    return this.configService.getOrThrow<number>('authentication.security.failureWindowMinutes');
  }

  async getFailedLoginAttempts(userId: string): Promise<number> {
    const key = authRedisKeys.failedLoginAttempts(userId);

    const value = await this.redisService.get(key);

    if (value === null) {
      return 0;
    }

    return Number(value);
  }

  async incrementFailedLoginAttempts(userId: string): Promise<number> {
    const key = authRedisKeys.failedLoginAttempts(userId);

    const attempts = await this.redisService.increment(key);

    if (attempts === 1) {
      await this.redisService.expire(key, this.failureWindowMinutes);
    }

    return attempts;
  }

  async resetFailedLoginAttempts(userId: string): Promise<void> {
    const key = authRedisKeys.failedLoginAttempts(userId);

    await this.redisService.delete(key);
  }

  async getFailedLoginAttemptsTtl(userId: string): Promise<number> {
    const key = authRedisKeys.failedLoginAttempts(userId);

    return this.redisService.ttl(key);
  }
}
