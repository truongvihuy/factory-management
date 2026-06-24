import { Injectable } from '@nestjs/common';
import { PayloadSensorDto } from '../dto/payload-sensor.dto';
import { TelemetryGateway } from './telemetry.gateway';

@Injectable()
export class TelemetryBroadcastService {
  constructor(private readonly gateway: TelemetryGateway) {}

  async broadcastTelemetry(payload: PayloadSensorDto) {
    this.gateway.emitTelemetry(payload);
  }

  async broadcastMachineStatus(machineCode: string, status: string) {
    this.gateway.emitMachineStatus({
      machineCode,
      status,
    });
  }
}
