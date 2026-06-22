import { Controller } from '@nestjs/common';
import { TelemetryService } from './telemetry.service';

@Controller('')
export class TelemetryController {
  constructor(private readonly telemetryService: TelemetryService) {}
}
