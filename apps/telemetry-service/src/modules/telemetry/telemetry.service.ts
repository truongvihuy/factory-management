import { PrismaService } from '@libs/database';
import { Injectable } from '@nestjs/common';
import { Telemetry } from 'generated/prisma';

@Injectable()
export class TelemetryService {
  constructor(private readonly prisma: PrismaService) {}

  async handleTelemetry(payload: Telemetry) {
    await this.prisma.telemetry.create({
      data: {
        sensorId: payload.sensorId,
        value: payload.value,
        recordedAt: new Date(payload.recordedAt),
      },
    });
  }
}
