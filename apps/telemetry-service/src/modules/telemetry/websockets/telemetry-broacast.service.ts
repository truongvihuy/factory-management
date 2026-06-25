import { Injectable } from '@nestjs/common';
import { TelemetryGateway } from './telemetry.gateway';

@Injectable()
export class TelemetryBroadcastService {
  constructor(private readonly gateway: TelemetryGateway) {}

  broadcastTelemetry(factoryCode: string, payload: any) {
    this.gateway.server.to(`factory:${factoryCode}`).emit('telemetry-updated', payload);
  }
}
