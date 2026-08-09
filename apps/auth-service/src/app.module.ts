import { Module, type MiddlewareConsumer } from '@nestjs/common';
import { LoggerModule } from './common/logger/logger.module';
import { CorrelationMiddleware } from './common/tracing/correlation.middleware';
import { TracingModule } from './common/tracing/tracing.module';
import { AppConfigModule } from './config/config.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [AppConfigModule, LoggerModule, TracingModule, HealthModule],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(CorrelationMiddleware).forRoutes('*');
  }
}
