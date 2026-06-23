import { PrismaService } from '@libs/database';
import { Injectable } from '@nestjs/common';
import { PayloadSensor } from './payload-sensor.dto';

@Injectable()
export class TelemetryService {
  constructor(private readonly prisma: PrismaService) {}

  async getDevice(deviceCode: string) {
    return this.prisma.deviceHeartBear.findUnique({ where: { deviceCode } });
  }

  async processTelemetry(payload: PayloadSensor) {
    const record = {
      sensorCode: payload.sensorCode,
      value: payload.value,
      recordedAt: new Date(payload.timestamp),
    };

    await Promise.all([
      this.prisma.sensorReading.create({ data: record }),
      this.prisma.sensorLatest.upsert({
        where: { sensorCode: payload.sensorCode },
        create: record,
        update: record,
      }),
    ]);
  }
}
