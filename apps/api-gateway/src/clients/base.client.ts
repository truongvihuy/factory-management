import { REQUEST_ID, RequestContext, USER_ID } from '@libs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

export class BaseClient {
  private readonly prefixUrl;
  constructor(
    protected readonly configService: ConfigService,
    private readonly httpService: HttpService,
    KEY_URL: string,
  ) {
    this.prefixUrl = this.configService.get(KEY_URL);
  }

  protected async _requestServer(
    method: 'get' | 'post' | 'put' | 'delete',
    url: string,
    body?: unknown,
    options?: RequestContext,
  ) {
    let axiosRes;
    const fullUrl = `${this.prefixUrl}${url}`;
    switch (method) {
      case 'get':
        axiosRes = this.httpService.get(fullUrl, {
          headers: {
            [REQUEST_ID]: options?.requestId,
            [USER_ID]: options?.userId,
          },
        });
        break;
      default:
        axiosRes = this.httpService[method](fullUrl, body as any, {
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
