import type { PrismaService } from '@libs/database';
import { Injectable } from '@nestjs/common';
import type { Sensor } from '@prisma';

@Injectable()
export class SensorMetadataRepository {
  constructor(private readonly prisma: PrismaService) {}

  async initMetadata(sensors: (Sensor & { machineCode: string })[]) {
    await this.prisma.$transaction(
      sensors.map((sensor) => {
        return this.prisma.sensorMetadata.upsert({
          where: { sensorCode: sensor.code },
          create: {
            sensorCode: sensor.code,
            machineCode: sensor.machineCode,
            name: sensor.name,
            metric: sensor.metric,
            unit: sensor.unit,
            status: sensor.status,
          },
          update: {
            machineCode: sensor.machineCode,
            name: sensor.name,
            metric: sensor.metric,
            unit: sensor.unit,
            status: sensor.status,
          },
        });
      }),
      {
        maxWait: 5000,
        timeout: sensors.length * 5000,
      },
    );
  }

  async get(code: string) {
    return this.prisma.sensorMetadata.findUnique({ where: { sensorCode: code } });
  }
}
