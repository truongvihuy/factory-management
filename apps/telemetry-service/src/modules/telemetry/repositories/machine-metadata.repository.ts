import { PrismaService } from '@libs/database';
import { Injectable } from '@nestjs/common';
import { Machine } from 'generated/prisma';

@Injectable()
export class MachineMetadataRepository {
  constructor(private readonly prisma: PrismaService) {}

  async initMetadata(machines: Machine[]) {
    await this.prisma.$transaction(
      machines.map((machine) => {
        return this.prisma.machineMetadata.upsert({
          where: { machineCode: machine.code },
          create: {
            machineCode: machine.code,
            name: machine.name,
            status: machine.status,
          },
          update: {
            name: machine.name,
            status: machine.status,
          },
        });
      }),
    );
  }

  async get(code: string) {
    return this.prisma.machineMetadata.findUnique({ where: { machineCode: code } });
  }
}
