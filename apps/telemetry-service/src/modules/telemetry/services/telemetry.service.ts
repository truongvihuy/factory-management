import { Injectable } from '@nestjs/common';
import { PayloadSensorDto } from '../dto/payload-sensor.dto';
import { SensorLatestRepository } from '../repositories/sensor-lastest.repository';
import { SensorReadingRepository } from '../repositories/sensor-reading.repository';
import { TelemetryBroadcastService } from '../websockets/telemetry-broacast.service';
import { TelemetryCacheService } from './telemetry-cache.service';
import { TelemetryValidatorService } from './telemetry-validator.service';

@Injectable()
export class TelemetryService {
  constructor(
    private readonly validator: TelemetryValidatorService,
    private readonly cache: TelemetryCacheService,
    private readonly broadcaster: TelemetryBroadcastService,
    private readonly sensorReadingRepo: SensorReadingRepository,
    private readonly sensorLatestRepo: SensorLatestRepository,
  ) {}

  async process(payload: PayloadSensorDto) {
    await this.validator.validate(payload);

    await this.sensorReadingRepo.create(payload);

    await this.sensorLatestRepo.upsert(payload);

    await this.cache.updateSensorLatest(payload);

    // await this.broadcaster.broadcastTelemetry(payload);
  }
}
