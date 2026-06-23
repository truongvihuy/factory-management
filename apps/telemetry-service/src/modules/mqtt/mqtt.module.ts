import { Module } from '@nestjs/common';
import { TelemetryModule } from '../telemetry/telemetry.module';
import { MqttService } from './mqtt.service';

@Module({
  imports: [TelemetryModule],
  providers: [MqttService],
  exports: [MqttService],
})
export class MqttModule {}
