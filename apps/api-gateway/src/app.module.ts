import { RequestIdMiddleware } from '@libs/common/middleware/request-id.middleware';
import { TestMiddleware } from '@libs/common/test';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './modules/auth/auth.module';
import { FactoryModule } from './modules/factories/factory.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'env/.env.api-gateway',
    }),
    AuthModule,
    FactoryModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestIdMiddleware).forRoutes('*');
    consumer.apply(TestMiddleware).forRoutes('*');
  }
}
