import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { BaseClient } from './base.client';

export class FactoryClient extends BaseClient {
  constructor(config: ConfigService, httpService: HttpService) {
    super(config, httpService, 'AUTH_SERVICE_URL');
  }
}
