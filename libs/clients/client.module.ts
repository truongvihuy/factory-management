import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { AuthClient } from './auth.client';
import { FactoryClient } from './factory.client';

@Module({
  imports: [HttpModule],
  providers: [AuthClient, FactoryClient],
  exports: [AuthClient, FactoryClient],
})
export class ClientModule {}
