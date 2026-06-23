import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { connect, MqttClient } from 'mqtt';
import { createHmac } from 'node:crypto';
import { PayloadSensor } from '../telemetry/payload-sensor.dto';
import { TelemetryService } from '../telemetry/telemetry.service';

@Injectable()
export class MqttService implements OnModuleInit {
  private client: MqttClient;
  constructor(
    private readonly configService: ConfigService,
    private readonly telemetryService: TelemetryService,
  ) {}

  onModuleInit() {
    this.client = connect(this.configService.get<string>('MQTT_URL', ''));

    this.client.on('connect', () => {
      console.log('MQTT Connected');

      this.client.subscribe('device/+');
    });

    let counter = 0;
    setInterval(() => {
      console.log(`Processed: ${counter} msg/s`);
      counter = 0;
    }, 1000);

    this.client.on('message', async (topic, message) => {
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
}
