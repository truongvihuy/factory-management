import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { connect, MqttClient } from 'mqtt';

@Injectable()
export class MqttService implements OnModuleInit {
  private client: MqttClient;
  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    this.client = connect(this.configService.get<string>('MQTT_URL', ''));

    this.client.on('connect', () => {
      console.log('MQTT Connected');

      this.client.subscribe('factory/+/workshop/+/machine/+/sensor/+');
    });

    this.client.on('message', (topic, payload) => {
      console.log(topic, payload.toString());
    });
  }
}
