import { Module } from '@nestjs/common';
import { PrismaModule } from 'libs/database';
import { InternalBootstrapController } from './internal-boostrap.controller';
import { InternalBootstrapService } from './internal-boostrap.service';

@Module({
  imports: [PrismaModule],
  controllers: [InternalBootstrapController],
  providers: [InternalBootstrapService],
})
export class InternalBootstrapModule {}
