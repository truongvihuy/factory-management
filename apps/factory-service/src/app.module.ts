import { RequestContextServiceMiddleware } from '@libs/common';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FactoryModule } from './modules/factory/factory.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'env/.env.factory-service',
    }),
    FactoryModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestContextServiceMiddleware).forRoutes('*');
  }
}
