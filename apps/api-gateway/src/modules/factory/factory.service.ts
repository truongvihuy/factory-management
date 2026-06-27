import { Injectable } from '@nestjs/common';
import { RequestContext } from 'libs/common';
import { FactoryClient } from '../../clients/factory.client';

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
