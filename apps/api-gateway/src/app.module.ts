import { RequestIdGatewayMiddleware } from '@libs/common';
import { TestMiddleware } from '@libs/common/test';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './modules/auth/auth.module';
import { FactoryModule } from './modules/factory/factory.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'env/.env.api-gateway',
    }),
    AuthModule,
    UserModule,
    FactoryModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestIdGatewayMiddleware).forRoutes('*');
    consumer.apply(TestMiddleware).forRoutes('*');
  }
}
