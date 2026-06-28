import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosRequestConfig } from 'axios';
import { HTTP_CLIENTS } from '../http-client.constants';

export const createHttpServiceProviders = (clients: HTTP_CLIENTS[]): Provider[] => {
  return clients.map((client) => {
    switch (client) {
      case HTTP_CLIENTS.AUTH:
        return {
          provide: HTTP_CLIENTS.AUTH,
          useFactory: (configService: ConfigService): AxiosRequestConfig => {
            const baseURL = configService.get<string>('AUTH_SERVICE_URL', '');
            return {
              baseURL,
            };
          },
          inject: [ConfigService],
        };
      case HTTP_CLIENTS.FACTORY: {
        return {
          provide: HTTP_CLIENTS.FACTORY,
          useFactory: (configService: ConfigService): AxiosRequestConfig => {
            const baseURL = configService.get<string>('FACTORY_SERVICE_URL', '');
            return {
              baseURL,
            };
          },
          inject: [ConfigService],
        };
      }
      case HTTP_CLIENTS.TELEMETRY: {
        return {
          provide: HTTP_CLIENTS.TELEMETRY,
          useFactory: (configService: ConfigService): AxiosRequestConfig => {
            const baseURL = configService.get<string>('TELEMETRY_SERVICE_URL', '');
            return {
              baseURL,
            };
          },
          inject: [ConfigService],
        };
      }
    }
  });
};
