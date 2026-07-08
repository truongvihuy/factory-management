import { FactoryProvider, Provider } from '@nestjs/common';
import { connect, IClientOptions } from 'mqtt';
import { MQTT_CLIENT } from '../mqtt.constants';

export const mqttClientProvider = (options: IClientOptions, inject?: FactoryProvider['inject']): Provider => ({
  provide: MQTT_CLIENT,
  useFactory: () => {
    return connect(options);
  },
  inject,
});

export const mqttFactoryProvider = (
  useFactory: (...args: any[]) => Promise<IClientOptions> | IClientOptions,
  inject?: FactoryProvider['inject'],
): Provider => ({
  provide: MQTT_CLIENT,
  useFactory: async (...args) => {
    const options = await useFactory(...args);
    return connect(options);
  },
  inject,
});
