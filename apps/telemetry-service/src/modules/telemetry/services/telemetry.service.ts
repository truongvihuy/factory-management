import type { FactoryClientService} from '@libs/http-client';
import { HTTP_CLIENTS } from '@libs/http-client';
import { Inject, Injectable } from '@nestjs/common';
import type { PayloadSensorDto } from '../dto/payload-sensor.dto';
import type { SensorLatestRepository } from '../repositories/sensor-lastest.repository';
import type { SensorReadingRepository } from '../repositories/sensor-reading.repository';
import type { TelemetryBroadcastService } from '../websockets/telemetry-broacast.service';
import type { TelemetryCacheService } from './telemetry-cache.service';
import type { TelemetryValidatorService } from './telemetry-validator.service';

@Injectable()
export class TelemetryService {
  constructor(
    @Inject(HTTP_CLIENTS.FACTORY)
    private readonly client: FactoryClientService,
    private readonly validator: TelemetryValidatorService,
    private readonly cache: TelemetryCacheService,
    private readonly broadcaster: TelemetryBroadcastService,
    private readonly sensorReadingRepo: SensorReadingRepository,
    private readonly sensorLatestRepo: SensorLatestRepository,
  ) {}

  async loadInternalBootstrap() {
    // const [machines, sensors, devices] = await Promise.all([
    //   this.client.getMachines(),
    //   this.client.getSensors(),
    //   this.client.getDevices(),
    // ]);
    // await this.validator.updateMetadata(machines, devices, sensors);
  }

  async process(payload: PayloadSensorDto) {
    await this.validator.validate(payload);

    await this.sensorReadingRepo.create(payload);

    await this.sensorLatestRepo.upsert(payload);

    await this.cache.updateSensorLatest(payload);

    await this.broadcaster.broadcastTelemetry('', payload);
  }
}
