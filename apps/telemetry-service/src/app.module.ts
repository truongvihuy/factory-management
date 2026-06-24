import { DEFAULT } from '@libs/common';
import { RedisModule } from '@libs/redis';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { TelemetryModule } from './modules/telemetry/telemetry.module';
import { WsModule } from './modules/websocket/ws.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'env/.env.telemetry-service',
    }),
    RedisModule.forRootAsync({
      isGlobal: true,
      useFactory: (configServive: ConfigService) => {
        return new Redis({
          host: configServive.get('REDIS_HOST', DEFAULT.REDIS_HOST),
          port: configServive.get('REDIS_HOST', DEFAULT.REDIS_PORT),
        });
      },
      inject: [ConfigService],
    }),
    WsModule,
    TelemetryModule,
  ],
})
export class AppModule {}
