import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
// import { TelemetryProcessor } from './telemetry.processor';

@Injectable()
export class TelemetryEventEmitter {
  constructor() {
    // private processor: TelemetryProcessor
  }

  @OnEvent('sensor.reading')
  handleSensor(data: any) {
    // this.processor.processSensorReading(data);
  }

  @OnEvent('machine.status')
  handleMachine(data: any) {
    // this.processor.processMachineStatus(data);
  }

  @OnEvent('device.heartbeat')
  handleHeartbeat(data: any) {
    // this.processor.processHeartbeat(data);
  }
}
