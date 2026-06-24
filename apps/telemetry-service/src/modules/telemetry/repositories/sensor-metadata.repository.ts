import { PrismaService } from '@libs/database';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SensorMetadataRepository {
  constructor(private readonly prisma: PrismaService) {}

  async get(code: string) {
    return this.prisma.sensorMetadata.findUnique({ where: { sensorCode: code } });
  }
}
