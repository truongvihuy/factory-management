import { FactoryClient } from '@libs/clients/factory.client';
import { RequestContext } from '@libs/common';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FactoryService {
  constructor(private readonly client: FactoryClient) {}

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
