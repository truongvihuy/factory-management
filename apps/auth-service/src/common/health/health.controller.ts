import { Controller, Get } from '@nestjs/common';
import { HealthCheck, type HealthCheckService, type MemoryHealthIndicator } from '@nestjs/terminus';

import type { DatabaseHealthIndicator } from './indicators/database.health';

@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly memory: MemoryHealthIndicator,
    private readonly database: DatabaseHealthIndicator,
  ) {}

  /**
   * Overall health check.
   * Checks application memory and database connectivity.
   */
  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.memory.checkHeap('memory_heap', 300 * 1024 * 1024),
      () => this.database.isHealthy(),
    ]);
  }

  /**
   * Liveness probe.
   * Indicates whether the application process is alive.
   * It must not depend on external services.
   */
  @Get('live')
  live() {
    return { status: 'ok' };
  }

  /**
   * Readiness probe.
   * Indicates whether the application is ready to receive traffic.
   * Database connectivity is required.
   */
  @Get()
  ready() {
    return this.health.check([() => this.database.isHealthy()]);
  }
}
