import { HttpModule } from '@nestjs/axios';
import { DynamicModule, Module, Provider } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HTTP_CLIENTS } from './http-client.constants';
import { createHttpServiceProviders } from './providers/http-service.provider';

@Module({})
export class HttpClientModule extends HttpModule {
  static forRootAsync(options: { isGlobal: boolean; clients: HTTP_CLIENTS[] }): DynamicModule {
    const extracProviders: Provider[] = createHttpServiceProviders(options.clients);

    return super.registerAsync({
      imports: [ConfigModule],
      global: options.isGlobal,
      extraProviders: extracProviders,
    });
  }
}
