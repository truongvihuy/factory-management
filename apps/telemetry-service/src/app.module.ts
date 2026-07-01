import { DEFAULT } from '@libs/common';
import { HTTP_CLIENTS, HttpClientModule } from '@libs/http-client';
import { RedisModule } from '@libs/redis';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisOptions } from 'ioredis';
import { TelemetryModule } from './modules/telemetry/telemetry.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'env/.env.telemetry-service',
    }),
    RedisModule.forRootAsync({
      isGlobal: true,
      useFactory: (configServive: ConfigService): RedisOptions => {
        return {
          host: configServive.get('REDIS_HOST', DEFAULT.REDIS_HOST),
          port: configServive.get('REDIS_PORT', DEFAULT.REDIS_PORT),
        };
      },
      inject: [ConfigService],
    }),
    HttpClientModule.register({
      isGlobal: true,
      clients: [HTTP_CLIENTS.FACTORY],
    }),
    TelemetryModule,
  ],
})
export class AppModule {}
