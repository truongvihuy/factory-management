import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { FactoryClient } from '../../clients/factory.client';
import { FactoryController } from './factory.controller';
import { FactoryService } from './factory.service';

@Module({
  imports: [HttpModule],
  controllers: [FactoryController],
  providers: [FactoryService, FactoryClient],
})
export class FactoryModule {}
