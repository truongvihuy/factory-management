import { Exceptions, REQUEST_ID, RequestContext, USER_ID } from '@libs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

export class HttpClientService {
  constructor(private readonly httpService: HttpService) {}

  protected async _requestServer(
    method: 'get' | 'post' | 'put' | 'delete',
    url: string,
    body?: unknown,
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
        axiosRes = this.httpService[method](url, body as any, {
          headers: {
            [REQUEST_ID]: options?.requestId,
            [USER_ID]: options?.userId,
          },
        });
    }

    const response = await firstValueFrom(axiosRes).catch((error) => {
      if (error.response) {
        throw error;
      }

      Exceptions.badGateway();
    });

    return response.data;
  }
}
