import { ModuleOptions } from '@libs/common';
import { DynamicModule, FactoryProvider, Module } from '@nestjs/common';
import { IClientOptions } from 'mqtt';
import { MQTT_CLIENT } from './mqtt.constants';
import { MqttService } from './mqtt.service';
import { mqttClientProvider, mqttFactoryProvider } from './providers/mqtt.provider';

@Module({})
export class MqttModule {
  static forRoot(options: IClientOptions & ModuleOptions): DynamicModule {
    return {
      module: MqttModule,
      global: options.isGlobal || false,
      providers: [MqttService, mqttClientProvider(options)],
      exports: [MqttService, MQTT_CLIENT],
    };
  }

  static forRootAsync(options: {
    isGlobal: boolean;
    useFactory: (...array: any[]) => Promise<IClientOptions> | IClientOptions;
    inject?: FactoryProvider['inject'];
  }): DynamicModule {
    return {
      module: MqttModule,
      global: options.isGlobal || false,
      providers: [MqttService, mqttFactoryProvider(options.useFactory, options.inject)],
      exports: [MqttService, MQTT_CLIENT],
    };
  }
}
