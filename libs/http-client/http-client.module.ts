import { DynamicModule, Module } from '@nestjs/common';
import { HttpModuleOptions } from './interfaces';
import { createHttpServiceProviders } from './providers/http-client.provider';

@Module({})
export class HttpClientModule {
  public static register(options: HttpModuleOptions): DynamicModule {
    const providers = createHttpServiceProviders(options.clients);

    return {
      module: HttpClientModule,
      global: options.isGlobal || false,
      providers,
      exports: providers,
    };
  }
}
