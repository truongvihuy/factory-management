import { HttpModule } from '@nestjs/axios';
import { DynamicModule, Module, Provider } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HTTP_CLIENTS } from './http-client.constants';
import { createHttpServiceProviders } from './providers/http-service.provider';
import { AuthClientService } from './services/auth-client.service';
import { FactoryClientService } from './services/factory-client.service';

@Module({})
export class HttpClientModule extends HttpModule {
  static forRootAsync(options: { isGlobal: boolean; clients: HTTP_CLIENTS[] }): DynamicModule {
    const extracProviders: Provider[] = createHttpServiceProviders(options.clients);

    const module = super.registerAsync({
      imports: [ConfigModule],
      global: options.isGlobal,
      extraProviders: extracProviders,
    });

    module.exports = [];

    for (const client of options.clients) {
      switch (client) {
        case HTTP_CLIENTS.AUTH: {
          module.exports.push(HTTP_CLIENTS.AUTH, AuthClientService);
          break;
        }
        case HTTP_CLIENTS.FACTORY: {
          module.exports.push(HTTP_CLIENTS.FACTORY, FactoryClientService);
          break;
        }
        case HTTP_CLIENTS.TELEMETRY: {
          module.exports.push(HTTP_CLIENTS.TELEMETRY);
          break;
        }
      }
    }

    return module;
  }
}
