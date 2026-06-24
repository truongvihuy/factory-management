import { PrismaService } from '@libs/database';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DeviceMetadataRepository {
  constructor(private readonly prisma: PrismaService) {}

  async get(code: string) {
    return this.prisma.deviceMetadata.findUnique({ where: { deviceCode: code } });
  }
}
