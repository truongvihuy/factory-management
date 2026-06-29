import { Exceptions, REQUEST_ID, RequestContext, USER_ID } from '@libs/common';
import { type AxiosInstance } from 'axios';
import { firstValueFrom, from } from 'rxjs';

export class HttpClientService {
  constructor(public readonly instance: AxiosInstance) {}

  protected async _requestServer(
    method: 'get' | 'post' | 'put' | 'delete',
    url: string,
    body?: unknown,
    options?: RequestContext,
  ) {
    let axiosRes;
    switch (method) {
      case 'get':
        axiosRes = this.instance.get(url, {
          headers: {
            [REQUEST_ID]: options?.requestId,
            [USER_ID]: options?.userId,
          },
        });
        break;
      default:
        axiosRes = this.instance[method](url, body as any, {
          headers: {
            [REQUEST_ID]: options?.requestId,
            [USER_ID]: options?.userId,
          },
        });
    }

    const response = await firstValueFrom(from(axiosRes)).catch((error) => {
      if (error.response) {
        throw error;
      }

      Exceptions.badGateway();
    });

    return (response as any).data;
  }
}
