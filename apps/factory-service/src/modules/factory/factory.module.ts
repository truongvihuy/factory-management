import { PrismaModule } from '@libs/database';
import { Module } from '@nestjs/common';
import { FactoryController } from './factory.controller';
import { FactoryService } from './factory.service';

@Module({
  imports: [PrismaModule],
  controllers: [FactoryController],
  providers: [FactoryService],
})
export class FactoryModule {}
