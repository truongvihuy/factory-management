import { REQUEST_ID, RequestContext, USER_ID } from '@libs/common';
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
    this.url = this.config.get('AUTH_SERVICE_URL');
  }

  private async _requestServer(
    method: 'get' | 'post' | 'put' | 'delete',
    url: string,
    body?: any,
    options?: RequestContext,
  ) {
    let axiosRes;
    switch (method) {
      case 'get':
        axiosRes = this.httpService.get(url, {
          headers: {
            [REQUEST_ID]: options?.requestId,
            [USER_ID]: options?.userId,
          },
        });
        break;
      default:
        axiosRes = this.httpService[method](url, body, {
          headers: {
            [REQUEST_ID]: options?.requestId,
            [USER_ID]: options?.userId,
          },
        });
    }

    const response = await firstValueFrom(axiosRes);
    return response.data;
  }

  async login(token: string, options?: RequestContext) {
    return this._requestServer('post', `${this.url}/auth/login`, { token }, options);
  }

  async verify(token: string, options?: RequestContext) {
    return this._requestServer('post', `${this.url}/auth/verify`, { token }, options);
  }

  async getUser(userId: string, options?: RequestContext) {
    return this._requestServer('get', `${this.url}/user/${userId}`, null, options);
  }
}
