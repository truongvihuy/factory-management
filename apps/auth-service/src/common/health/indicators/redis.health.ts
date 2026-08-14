import { Injectable } from '@nestjs/common';
import { HealthCheckError, HealthIndicator, HealthIndicatorResult } from '@nestjs/terminus';

import { RedisService } from '@/infrastructure/redis/redis.service';

@Injectable()
export class RedisHealthIndicator extends HealthIndicator {
  constructor(private readonly redisService: RedisService) {
    super();
  }

  async isHealthy(): Promise<HealthIndicatorResult> {
    try {
      const result = await this.redisService.ping();

      const isHealthy = result === 'PONG';

      const healthResult = this.getStatus('redis', isHealthy);

      if (!isHealthy) {
        throw new HealthCheckError('Redis health check failed', healthResult);
      }

      return healthResult;
    } catch (error) {
      throw new HealthCheckError('Redis health check failed', this.getStatus('redis', false));
    }
  }
}
