import type { MqttService } from '@libs/mqtt';
import type { OnModuleInit } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import type { PayloadSensorDto } from '../dto/payload-sensor.dto';
import type { TelemetryService } from '../services/telemetry.service';

@Injectable()
export class TelemetryConsumer implements OnModuleInit {
  constructor(
    private readonly mqttService: MqttService,
    private readonly telemetryService: TelemetryService,
  ) {}

  async onModuleInit() {
    // this.telemetryService.loadInternalBootstrap();
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
        await this.telemetryService.process(payload);
        // console.log(`[${topic}], completed`);
      } catch (e: any) {
        console.log(`[${topic}], error ${e.message}`);
      }
    });
  }

  async decodeMessage(topic: string, message: Buffer) {
    // console.log(`[${topic}] ${message.length} ${message.byteLength}`);
    const [_, deviceCode] = topic.split('/');
    const payload = JSON.parse(message.toString()) as PayloadSensorDto;
    payload.deviceCode = deviceCode;

    return payload;
  }
}
