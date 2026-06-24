import { PrismaModule } from '@libs/database';
import { MqttModule } from '@libs/mqtt';
import { Module } from '@nestjs/common';
import { TelemetryConsumer } from './telemetry.consumer';
import { TelemetryService } from './telemetry.service';

@Module({
  imports: [PrismaModule, MqttModule],
  providers: [TelemetryService, TelemetryConsumer],
  exports: [TelemetryService],
})
export class TelemetryModule {}
