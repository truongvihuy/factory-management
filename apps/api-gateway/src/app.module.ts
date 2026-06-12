import { Module } from '@nestjs/common';

import { AuthModule } from './modules/auth/auth.module';
import { FactoryModule } from './modules/factories/factory.module';

@Module({
  imports: [AuthModule, FactoryModule],
})
export class AppModule {}
