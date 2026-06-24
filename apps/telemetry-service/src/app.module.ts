import { RedisModule } from '@libs/redis';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MqttModule } from './modules/mqtt/mqtt.module';
import { WsModule } from './modules/websocket/ws.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'env/.env.telemetry-service',
    }),
    RedisModule.forRoot({
      isGlobal: true,
      host: process.env.REDIS_HOST,
      port: +process.env.PORT!,
    }),
    WsModule,
    MqttModule,
  ],
})
export class AppModule {}
