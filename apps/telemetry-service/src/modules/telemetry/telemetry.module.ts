import { PrismaModule } from '@libs/database';
import { MqttModule } from '@libs/mqtt';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as mqtt from 'mqtt';
import { TelemetryConsumer } from './telemetry.consumer';
import { TelemetryService } from './telemetry.service';

@Module({
  imports: [
    PrismaModule,
    MqttModule.forRootAsync({
      isGlobal: false,
      useFactory: (configServive: ConfigService) => {
        return mqtt.connect({
          host: configServive.get('MQTT_HOST'),
          port: configServive.get('MQTT_PORT'),
        });
      },
      inject: [ConfigService],
    }),
  ],
  providers: [TelemetryService, TelemetryConsumer],
  exports: [TelemetryService],
})
export class TelemetryModule {}
