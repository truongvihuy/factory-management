import { Module, type MiddlewareConsumer } from '@nestjs/common';

import { AppConfigModule } from './common/config/config.module';
import { PrismaModule } from './infrastructure/database/prisma/prisma.module';
import { HealthModule } from './infrastructure/health/health.module';
import { LoggerModule } from './infrastructure/logger/logger.module';
import { RedisModule } from './infrastructure/redis/redis.module';
import { CorrelationMiddleware } from './infrastructure/tracing/correlation.middleware';
import { TracingModule } from './infrastructure/tracing/tracing.module';
import { AuthenticationModule } from './modules/authentication/authentication.module';

@Module({
  imports: [
    AppConfigModule,
    LoggerModule,
    TracingModule,
    HealthModule,

    PrismaModule,
    RedisModule,

    AuthenticationModule,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(CorrelationMiddleware).forRoutes('*');
  }
}
