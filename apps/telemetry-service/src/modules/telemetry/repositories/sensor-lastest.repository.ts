import type { PrismaService } from '@libs/database';
import { Injectable } from '@nestjs/common';
import type { PayloadSensorDto } from '../dto/payload-sensor.dto';

@Injectable()
export class SensorLatestRepository {
  constructor(private readonly prisma: PrismaService) {}

  async upsert(payload: PayloadSensorDto) {
    return this.prisma.sensorLatest.upsert({
      where: {
        sensorCode: payload.sensorCode,
      },
      create: {
        sensorCode: payload.sensorCode,
        value: payload.value,
        recordedAt: new Date(payload.timestamp),
      },
      update: {
        value: payload.value,
        recordedAt: new Date(payload.timestamp),
      },
    });
  }
}
