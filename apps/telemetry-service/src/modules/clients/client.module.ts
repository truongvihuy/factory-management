import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { FactoryClient } from './factory.client';

@Module({
  imports: [HttpModule],
  providers: [FactoryClient],
  exports: [FactoryClient],
})
export class ClientModule {}
