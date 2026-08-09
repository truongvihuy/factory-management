import { JwtAuthGuard, PermissionGuard, RequestContextGateWayMiddleware } from '@libs/common';
import { TestMiddleware } from '@libs/common/test';
import { HTTP_CLIENTS, HttpClientModule } from '@libs/http-client';
import type { MiddlewareConsumer, NestModule } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './modules/auth/auth.module';
import { FactoryModule } from './modules/factory/factory.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'env/.env.api-gateway',
    }),
    HttpClientModule.register({
      isGlobal: true,
      clients: [HTTP_CLIENTS.AUTH, HTTP_CLIENTS.FACTORY, HTTP_CLIENTS.TELEMETRY],
    }),
    AuthModule,
    UserModule,
    FactoryModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestContextGateWayMiddleware).forRoutes('*');
    consumer.apply(TestMiddleware).forRoutes('*');
  }
}
