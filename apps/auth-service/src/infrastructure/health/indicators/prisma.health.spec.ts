import { HealthCheckError } from '@nestjs/terminus';

import { PrismaHealthIndicator } from './prisma.health';

describe('PrismaHealthIndicator', () => {
  let indicator: PrismaHealthIndicator;

  let prisma: {
    $queryRaw: jest.Mock;
  };

  beforeEach(() => {
    prisma = {
      $queryRaw: jest.fn(),
    };

    indicator = new PrismaHealthIndicator(prisma as never);
  });

  describe('isHealthy()', () => {
    it('should return database as healthy when query succeeds', async () => {
      prisma.$queryRaw.mockResolvedValue([{ result: 1 }]);

      const result = await indicator.isHealthy();

      expect(result).toEqual({
        database: {
          status: 'up',
        },
      });

      expect(prisma.$queryRaw).toHaveBeenCalledTimes(1);
    });

    it('should throw HealthCheckError when database query fails', async () => {
      prisma.$queryRaw.mockRejectedValue(new Error('Database connection failed'));

      await expect(indicator.isHealthy()).rejects.toThrow(HealthCheckError);

      expect(prisma.$queryRaw).toHaveBeenCalledTimes(1);
    });
  });
});
