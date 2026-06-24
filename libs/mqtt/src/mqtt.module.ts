import { DynamicModule, InjectionToken, Module, OptionalFactoryDependency } from '@nestjs/common';
import * as mqtt from 'mqtt';
import { MQTT_CLIENT } from './mqtt.constants';
import { MqttService } from './mqtt.service';

@Module({})
export class MqttModule {
  static forRoot(options: { brokerUrl: string; isGlobal?: boolean }): DynamicModule {
    return {
      module: MqttModule,
      global: options.isGlobal || false,
      providers: [
        {
          provide: MQTT_CLIENT,
          useFactory: () => {
            return mqtt.connect(options.brokerUrl);
          },
        },
        MqttService,
      ],
      exports: [MqttService],
    };
  }

  static forRootAsync(options: {
    isGlobal: boolean;
    useFactory: (...array: any[]) => any;
    inject?: (InjectionToken | OptionalFactoryDependency)[];
  }): DynamicModule {
    return {
      module: MqttModule,
      global: options.isGlobal || false,
      providers: [
        {
          provide: MQTT_CLIENT,
          useFactory: options.useFactory,
          inject: options.inject,
        },
        MqttService,
      ],
      exports: [MQTT_CLIENT],
    };
  }
}
