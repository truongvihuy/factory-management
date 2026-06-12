import { Controller } from '@nestjs/common';

import { FactoryService } from './factory.service';

@Controller('factories')
export class FactoryController {
  constructor(private readonly factoryService: FactoryService) {}
}
