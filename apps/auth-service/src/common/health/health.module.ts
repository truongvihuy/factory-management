import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';

import { PrismaModule } from '@/infrastructure/database/prisma/prisma.module';

import { HealthController } from './health.controller';
import { DatabaseHealthIndicator } from './indicators/database.health';

@Module({
  imports: [TerminusModule, HealthModule, PrismaModule],
  controllers: [HealthController],
  providers: [DatabaseHealthIndicator],
})
export class HealthModule {}
