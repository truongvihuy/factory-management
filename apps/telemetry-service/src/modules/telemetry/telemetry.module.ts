import { Module } from '@nestjs/common';
import { PrismaModule } from 'libs/database';
import { TelemetryService } from './telemetry.service';

@Module({
  imports: [PrismaModule],
  providers: [TelemetryService],
  exports: [TelemetryService],
})
export class TelemetryModule {}
