import { RequestIdServiceMiddleware } from '@libs/common';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { FactoryService } from './modules/factory/factory.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'env/.env.factory-service',
    }),
    FactoryService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestIdServiceMiddleware).forRoutes('*');
  }
}
