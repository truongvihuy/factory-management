import { Inject, Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { MqttClient } from 'mqtt';
import { MQTT_CLIENT } from './mqtt.constants';

@Injectable()
export class MqttService implements OnModuleDestroy, OnModuleInit {
  constructor(
    @Inject(MQTT_CLIENT)
    private readonly client: MqttClient,
  ) {}

  onModuleInit() {
    this.client.connect();
  }

  onModuleDestroy() {
    this.client.end();
  }

  publish(topic: string, payload: Record<string, any>): Promise<void> {
    return new Promise((resolve, reject) => {
      this.client.publish(topic, JSON.stringify(payload), {}, (error) => {
        if (error) return reject(error);

        resolve();
      });
    });
  }

  subscribe(topic: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.client.subscribe(topic, (error) => {
        if (error) return reject(error);

        resolve();
      });
    });
  }

  getClient() {
    return this.client;
  }
}
