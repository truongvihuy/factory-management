import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import { MqttClient } from 'mqtt';
import { MQTT_CLIENT } from './mqtt.constants';

@Injectable()
export class MqttService implements OnModuleDestroy {
  constructor(
    @Inject(MQTT_CLIENT)
    private readonly client: MqttClient,
  ) {}

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

  onModuleDestroy() {
    this.client.end();
  }
}
