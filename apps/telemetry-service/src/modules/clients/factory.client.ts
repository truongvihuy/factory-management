import { RequestContext } from '@libs/common';
import { BaseClient } from '@libs/utils/base.client';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FactoryClient extends BaseClient {
  constructor(configService: ConfigService, httpService: HttpService) {
    super(configService, httpService, 'FACTORY_SERVICE_URL');
  }

  getMachines(options?: RequestContext) {
    return this._requestServer('get', '/internal-bootstrap/machines', null, options);
  }

  getSensors(options?: RequestContext) {
    return this._requestServer('get', '/internal-bootstrap/sensors', null, options);
  }

  getDevices(options?: RequestContext) {
    return this._requestServer('get', `/internal-bootstrap/devices`, null, options);
  }
}
