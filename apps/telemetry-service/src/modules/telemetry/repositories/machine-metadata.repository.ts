import { PrismaService } from '@libs/database';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MachineMetadataRepository {
  constructor(private readonly prisma: PrismaService) {}

  async get(code: string) {
    return this.prisma.machineMetadata.findUnique({ where: { machineCode: code } });
  }
}
