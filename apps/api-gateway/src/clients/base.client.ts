import { REQUEST_ID, RequestContext, USER_ID } from '@libs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

export class BaseClient {
  protected readonly prefixUrl;
  constructor(
    protected readonly config: ConfigService,
    protected readonly httpService: HttpService,
    KEY_URL: string,
  ) {
    this.prefixUrl = this.config.get(KEY_URL);
  }

  protected async _requestServer(
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
}
