import { ModuleInject } from '@libs/common';
import { Provider } from '@nestjs/common';
import { connect, IClientOptions } from 'mqtt';
import { MQTT_CLIENT } from '../mqtt.constants';

export const mqttClientProvider = (options: IClientOptions, inject?: ModuleInject[]): Provider => ({
  provide: MQTT_CLIENT,
  useFactory: () => {
    return connect(options);
  },
  inject,
});

export const mqttFactoryProvider = (
  useFactory: (...args: any[]) => IClientOptions,
  inject?: ModuleInject[],
): Provider => ({
  provide: MQTT_CLIENT,
  useFactory(...args) {
    const options = useFactory(...args);
    return connect(options);
  },
  inject,
});
