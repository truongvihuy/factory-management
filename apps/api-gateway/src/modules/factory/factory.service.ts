import { RequestContext } from '@libs/common';
import { FactoryClientService, HTTP_CLIENTS } from '@libs/http-client';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class FactoryService {
  constructor(
    @Inject(HTTP_CLIENTS.FACTORY)
    private readonly client: FactoryClientService,
  ) {}

  getFactoryListAll(options?: RequestContext) {
    return this.client.getFactoryListAll(options);
  }

  getWorkshopsOfFactory(factoryId: string, options?: RequestContext) {
    return this.client.getWorkshopInFactory(factoryId, options);
  }

  getMachineInWorkshop(factoryId: string, workshopId: string, options?: RequestContext) {
    return this.client.getMachineInWorkshop(factoryId, workshopId, options);
  }
}
