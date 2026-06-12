import { Module } from '@nestjs/common';
import { FactoryModule } from './modules/factories/factory.module';

@Module({
  imports: [FactoryModule],
})
export class AppModule {}
