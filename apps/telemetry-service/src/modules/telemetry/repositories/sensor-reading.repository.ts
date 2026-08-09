import type { PrismaService } from '@libs/database';
import { Injectable } from '@nestjs/common';
import type { PayloadSensorDto } from '../dto/payload-sensor.dto';

@Injectable()
export class SensorReadingRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(payload: PayloadSensorDto) {
    return this.prisma.sensorReading.create({
      data: {
        sensorCode: payload.sensorCode,
        value: payload.value,
        recordedAt: new Date(payload.timestamp),
      },
    });
  }
}
