import { Controller, Get, Req } from '@nestjs/common';

import { Permission } from 'generated/prisma';
import { FactoryService } from './factory.service';

@Controller('factory')
export class FactoryController {
  constructor(private readonly factoryService: FactoryService) {}

  @Get('')
  getFactoryList(@Req() req: any) {
    const permissions: Permission[] = req.user.permission;
    const factoryIds = permissions.map((per) => per.factoryId);

    return this.factoryService.getFactoryListByIds(factoryIds);
  }

  @Get('all')
  getFactoryListAll() {
    return this.factoryService.getFactoryListAll();
  }
}
