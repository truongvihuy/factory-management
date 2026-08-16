import { Injectable } from '@nestjs/common';
import { HealthCheckError, HealthIndicator, type HealthIndicatorResult } from '@nestjs/terminus';

import { PrismaService } from '@/infrastructure/database/prisma/prisma.service';

@Injectable()
export class PrismaHealthIndicator extends HealthIndicator {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async isHealthy(): Promise<HealthIndicatorResult> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;

      return this.getStatus('database', true);
    } catch {
      throw new HealthCheckError('Database health check failed', this.getStatus('database', false));
    }
  }
}
