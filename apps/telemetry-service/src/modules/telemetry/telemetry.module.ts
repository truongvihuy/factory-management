import { DEFAULT } from '@libs/common';
import { PrismaModule } from '@libs/database';
import { MqttModule } from '@libs/mqtt';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as mqtt from 'mqtt';
import { ClientModule } from '../clients/client.module';
import { TelemetryConsumer } from './consumers/telemetry.consumer';
import { DeviceMetadataRepository } from './repositories/device-metadata.repository';
import { MachineMetadataRepository } from './repositories/machine-metadata.repository';
import { SensorLatestRepository } from './repositories/sensor-lastest.repository';
import { SensorMetadataRepository } from './repositories/sensor-metadata.repository';
import { SensorReadingRepository } from './repositories/sensor-reading.repository';
import { TelemetryCacheService } from './services/telemetry-cache.service';
import { TelemetryValidatorService } from './services/telemetry-validator.service';
import { TelemetryService } from './services/telemetry.service';
import { TelemetryBroadcastService } from './websockets/telemetry-broacast.service';
import { TelemetryGateway } from './websockets/telemetry.gateway';

@Module({
  imports: [
    PrismaModule,
    MqttModule.forRootAsync({
      isGlobal: false,
      useFactory: (configServive: ConfigService) => {
        return mqtt.connect({
          host: configServive.get('MQTT_HOST', DEFAULT.MQTT_HOST),
          port: configServive.get('MQTT_PORT', DEFAULT.MQTT_PORT),
        });
      },
      inject: [ConfigService],
    }),
    ClientModule,
  ],
  providers: [
    TelemetryService,
    TelemetryValidatorService,
    TelemetryCacheService,
    TelemetryConsumer,
    TelemetryBroadcastService,
    TelemetryGateway,
    SensorMetadataRepository,
    MachineMetadataRepository,
    DeviceMetadataRepository,
    SensorLatestRepository,
    SensorReadingRepository,
  ],
  exports: [TelemetryService],
})
export class TelemetryModule {}
