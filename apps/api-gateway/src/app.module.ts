import { RequestContextGateWayMiddleware } from '@libs/common';
import { TestMiddleware } from '@libs/common/test';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ClientModule } from './clients/client.module';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { PermissionGuard } from './guards/permission.guard';
import { AuthModule } from './modules/auth/auth.module';
import { FactoryModule } from './modules/factory/factory.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'env/.env.api-gateway',
    }),
    ClientModule,
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
