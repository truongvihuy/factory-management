import { RequestContext } from '@libs/common';
import { Injectable } from '@nestjs/common';

import { FactoryClient } from '../../clients/factory.client';

@Injectable()
export class FactoryService {
  constructor(private readonly client: FactoryClient) {}

  getFactoryListAll(options?: RequestContext) {
    return this.client.getFactoryListAll(options);
  }
}
