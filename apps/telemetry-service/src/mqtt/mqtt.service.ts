import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { connect, MqttClient } from 'mqtt';
import { TelemetryService } from '../modules/telemetry/telemetry.service';

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

      this.client.subscribe('factory/+/workshop/+/machine/+/sensor/+');
    });

    this.client.on('message', async (topic, message) => {
      try {
        const payload = JSON.parse(message.toString());
        await this.telemetryService.processTelemetry(payload);
        console.log(`[${topic}] ${message}, completed`);
      } catch (e) {
        console.log(`[${topic}] ${message}, error ${e}`);
      }
    });
  }
}
