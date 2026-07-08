import { Inject, Injectable } from '@nestjs/common';
import { type AxiosInstance } from 'axios';
import { HTTP_CLIENTS } from '../http-client.constants';
import { HttpClientService } from './http-client.service';

@Injectable()
export class TelemetryClientService extends HttpClientService {
  constructor(
    @Inject(HTTP_CLIENTS.TELEMETRY)
    instance: AxiosInstance,
  ) {
    super(instance);
  }
}
