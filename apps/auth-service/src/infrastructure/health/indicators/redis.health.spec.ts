import { HealthCheckError } from '@nestjs/terminus';

import { RedisHealthIndicator } from './redis.health';

describe('RedisHealthIndicator', () => {
  let indicator: RedisHealthIndicator;

  let redisService: {
    ping: jest.Mock;
  };

  beforeEach(() => {
    redisService = {
      ping: jest.fn(),
    };

    indicator = new RedisHealthIndicator(redisService as never);
  });

  describe('isHealthy()', () => {
    it('should report Redis as healthy when ping returns PONG', async () => {
      redisService.ping.mockResolvedValue('PONG');

      const result = await indicator.isHealthy();

      expect(result).toEqual({
        redis: {
          status: 'up',
        },
      });

      expect(redisService.ping).toHaveBeenCalledTimes(1);
    });

    it('should report Redis as unhealthy when ping fails', async () => {
      redisService.ping.mockRejectedValue(new Error('Redis connection failed'));

      await expect(indicator.isHealthy()).rejects.toThrow(HealthCheckError);

      expect(redisService.ping).toHaveBeenCalledTimes(1);
    });

    it('should report Redis as unhealthy when ping does not return PONG', async () => {
      redisService.ping.mockResolvedValue('NOT_PONG');

      await expect(indicator.isHealthy()).rejects.toThrow(HealthCheckError);

      expect(redisService.ping).toHaveBeenCalledTimes(1);
    });
  });
});
