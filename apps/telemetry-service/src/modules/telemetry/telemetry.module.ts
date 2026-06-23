import { PrismaModule } from '@libs/database';
import { Module } from '@nestjs/common';
import { TelemetryService } from './telemetry.service';

@Module({
  imports: [PrismaModule],
  providers: [TelemetryService],
  exports: [TelemetryService],
})
export class TelemetryModule {}
