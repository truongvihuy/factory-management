import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { connect, MqttClient } from 'mqtt';
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

      this.client.subscribe('factory/+/workshop/+/machine/+/sensor/+');
    });

    let counter = 0;
    setInterval(() => {
      console.log(`Processed: ${counter} msg/s`);
      counter = 0;
    }, 1000);

    this.client.on('message', async (topic, message) => {
      counter++;

      console.log(topic, JSON.parse(message.toString()));
      try {
        const payload = JSON.parse(message.toString()) as PayloadSensor;
        await this.telemetryService.processTelemetry(payload);
        console.log(`[${topic}], completed`);
      } catch (e) {
        console.log(`[${topic}], error ${e}`);
      }
    });
  }
}
