import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import { HTTP_CLIENTS } from '../http-client.constants';
import { AuthClientService } from '../services/auth-client.service';
import { FactoryClientService } from '../services/factory-client.service';
import { HttpClientService } from '../services/http-client.service';

export const HTTP_CLIENTS_CONFIG = {
  [HTTP_CLIENTS.AUTH]: {
    key: 'AUTH_SERVICE_URL',
    service: AuthClientService,
  },
  [HTTP_CLIENTS.FACTORY]: {
    key: 'FACTORY_SERVICE_URL',
    service: FactoryClientService,
  },
  [HTTP_CLIENTS.TELEMETRY]: {
    key: 'TELEMETRY_SERVICE_URL',
    service: HttpClientService,
  },
};

export const createHttpServiceProviders = (clients: HTTP_CLIENTS[]): Provider[] => {
  const providers: Provider[] = [];
  for (const client of clients) {
    const cfg = HTTP_CLIENTS_CONFIG[client];
    providers.push(
      {
        provide: client,
        useFactory: (configService: ConfigService): AxiosInstance => {
          const baseURL = configService.getOrThrow<string>(cfg.key);
          return axios.create({
            baseURL,
          });
        },
        inject: [ConfigService],
      },
      cfg.service,
    );
  }

  return providers;
};
