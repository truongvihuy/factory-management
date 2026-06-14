import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthClient {
  private readonly url;
  constructor(
    private readonly config: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.url = this.config.get('AUTH_SERVICE_URL') ?? '';
  }

  async login(payload: any) {
    const response = await firstValueFrom(this.httpService.post(this.url, payload));
    return response.data;
  }

  async verify(token: any) {
    const response = await firstValueFrom(this.httpService.post(this.url, { token }));
    return response.data;
  }
}
