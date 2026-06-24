import { MqttService } from '@libs/mqtt';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { createHmac } from 'crypto';
import { PayloadSensor } from './payload-sensor.dto';
import { TelemetryService } from './telemetry.service';

@Injectable()
export class TelemetryConsumer implements OnModuleInit {
  constructor(
    private readonly mqttService: MqttService,
    private readonly telemetryService: TelemetryService,
  ) {}

  async onModuleInit() {
    await this.mqttService.subscribe('device/+');

    let counter = 0;
    setInterval(() => {
      console.log(`Processed: ${counter} msg/s`);
      counter = 0;
    }, 1000);

    const client = this.mqttService.getClient();

    client.on('message', async (topic, message) => {
      counter++;

      try {
        const payload = await this.decodeMessage(topic, message);
        await this.telemetryService.processTelemetry(payload);
        console.log(`[${topic}], completed`);
      } catch (e: any) {
        console.log(`[${topic}], error ${e.message}`);
      }
    });
  }

  async decodeMessage(topic: string, message: Buffer) {
    console.log(`[${topic}] ${message.length} ${message.byteLength}`);
    const [_, deviceCode] = topic.split('/');
    const payload = JSON.parse(message.toString()) as PayloadSensor;
    payload.deviceCode = deviceCode;

    await this.validateSignature(payload);

    return payload;
  }

  async validateSignature(payload: PayloadSensor) {
    let _payload = {
      deviceCode: payload.deviceCode,
      sensorCode: payload.deviceCode,
      value: payload.value,
      timestamp: payload.timestamp,
    };

    const device = await this.telemetryService.getDevice(payload.deviceCode);

    if (!device) {
      throw new Error('Device not found');
    }

    const expected = createHmac('sha256', device.secretKey).update(JSON.stringify(_payload)).digest('hex');

    if (expected !== payload.signature) {
      throw new Error('Signature invalid');
    }

    return true;
  }

  async syncMetadata() {}
}
