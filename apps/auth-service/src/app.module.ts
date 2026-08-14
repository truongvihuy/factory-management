import { Module, type MiddlewareConsumer } from '@nestjs/common';

import { AppConfigModule } from './common/config/config.module';
import { HealthModule } from './common/health/health.module';
import { LoggerModule } from './common/logger/logger.module';
import { CorrelationMiddleware } from './common/tracing/correlation.middleware';
import { TracingModule } from './common/tracing/tracing.module';
import { PrismaModule } from './infrastructure/database/prisma/prisma.module';
import { RedisModule } from './infrastructure/redis/redis.module';
import { AuthenticationModule } from './modules/authentication/authentication.module';
import { PermissionsModule } from './modules/permissions/permissions.module';
import { RolesModule } from './modules/roles/roles.module';
import { SessionsModule } from './modules/sessions/sessions.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    AppConfigModule,
    LoggerModule,
    TracingModule,
    HealthModule,

    PrismaModule,
    RedisModule,

    UsersModule,
    AuthenticationModule,
    RolesModule,
    PermissionsModule,
    SessionsModule,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(CorrelationMiddleware).forRoutes('*');
  }
}
