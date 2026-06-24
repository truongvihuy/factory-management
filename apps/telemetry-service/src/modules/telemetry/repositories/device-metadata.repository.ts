import { PrismaService } from '@libs/database';
import { Injectable } from '@nestjs/common';
import { Device } from 'generated/prisma';

@Injectable()
export class DeviceMetadataRepository {
  constructor(private readonly prisma: PrismaService) {}

  async initMetadata(devices: (Device & { machineCode: string })[]) {
    await this.prisma.$transaction(
      devices.map((device) => {
        return this.prisma.deviceMetadata.upsert({
          where: { deviceCode: device.code },
          create: {
            deviceCode: device.code,
            machineCode: device.machineCode,
            name: device.name,
            secretKey: device.secretKey,
            status: device.status,
          },
          update: {
            machineCode: device.machineCode,
            name: device.name,
            secretKey: device.secretKey,
            status: device.status,
          },
        });
      }),
    );
  }

  async get(code: string) {
    return this.prisma.deviceMetadata.findUnique({ where: { deviceCode: code } });
  }
}
