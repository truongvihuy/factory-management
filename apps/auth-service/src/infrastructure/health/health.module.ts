import { Module } from '@nestjs/common';
import { PrismaHealthIndicator, TerminusModule } from '@nestjs/terminus';

import { PrismaModule } from '@/infrastructure/database/prisma/prisma.module';
import { RedisModule } from '@/infrastructure/redis/redis.module';

import { HealthController } from './health.controller';
import { RedisHealthIndicator } from './indicators/redis.health';

@Module({
  imports: [TerminusModule, HealthModule, PrismaModule, RedisModule],
  controllers: [HealthController],
  providers: [PrismaHealthIndicator, RedisHealthIndicator],
})
export class HealthModule {}
