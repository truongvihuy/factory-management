import { RequestContextServiceMiddleware } from '@libs/common';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FactoryModule } from './modules/factory/factory.module';
import { InternalBootstrapModule } from './modules/internal/internal-boostrap.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'env/.env.factory-service',
    }),
    FactoryModule,
    InternalBootstrapModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestContextServiceMiddleware).forRoutes('factory/*');
  }
}
