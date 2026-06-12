import { Injectable } from '@nestjs/common';

import { FactoryClient } from 'apps/api-gateway/clients/factory.client';

@Injectable()
export class FactoryService {
  constructor(private readonly client: FactoryClient) {}
}
