import { Module } from '@nestjs/common';
import { ClientModule } from '../../clients/client.module';
import { FactoryController } from './factory.controller';
import { FactoryService } from './factory.service';

@Module({
  imports: [ClientModule],
  controllers: [FactoryController],
  providers: [FactoryService],
})
export class FactoryModule {}
