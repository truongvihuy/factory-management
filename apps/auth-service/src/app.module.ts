import { Module, type MiddlewareConsumer } from '@nestjs/common';

import { AppConfigModule } from './common/config/config.module';
import { HealthModule } from './common/health/health.module';
import { LoggerModule } from './common/logger/logger.module';
import { CorrelationMiddleware } from './common/tracing/correlation.middleware';
import { TracingModule } from './common/tracing/tracing.module';
import { PrismaModule } from './infrastructure/database/prisma/prisma.module';
import { RedisModule } from './infrastructure/redis/redis.module';
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
