import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService, MemoryHealthIndicator, type HealthCheckResult } from '@nestjs/terminus';

import { HEALTH_MEMORY_HEAP_LIMIT_BYTES } from './health.constants';
import { DatabaseHealthIndicator } from './indicators/database.health';
import { RedisHealthIndicator } from './indicators/redis.health';

@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly memory: MemoryHealthIndicator,
    private readonly database: DatabaseHealthIndicator,
    private readonly redis: RedisHealthIndicator,
  ) {}

  /**
   * Overall health check.
   *
   * Checks:
   * - Application memory
   * - PostgreSQL connectivity
   * - Redis connectivity
   *
   * Used to determine whether the application and
   * its required infrastructure dependencies are healthy.
   */
  @Get()
  @HealthCheck()
  check(): Promise<HealthCheckResult> {
    return this.health.check([
      () => this.memory.checkHeap('memory_heap', HEALTH_MEMORY_HEAP_LIMIT_BYTES),
      () => this.database.isHealthy(),
      () => this.redis.isHealthy(),
    ]);
  }

  /**
   * Liveness probe.
   *
   * Indicates whether the application process is alive.
   *
   * This endpoint must not depend on external services
   * such as PostgreSQL or Redis.
   */
  @Get('live')
  live(): { status: 'ok' } {
    return {
      status: 'ok',
    };
  }

  /**
   * Readiness probe.
   *
   * Indicates whether the application is ready to receive traffic.
   *
   * PostgreSQL and Redis are required infrastructure dependencies
   * for the application.
   */
  @Get('ready')
  @HealthCheck()
  ready(): Promise<HealthCheckResult> {
    return this.health.check([() => this.database.isHealthy(), () => this.redis.isHealthy()]);
  }
}
