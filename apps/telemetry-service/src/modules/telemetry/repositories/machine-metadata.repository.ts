import { PrismaService } from '@libs/database';
import { Injectable } from '@nestjs/common';
import { Machine } from '@prisma';

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
      {
        maxWait: 5000,
        timeout: machines.length * 5000,
      },
    );
  }

  async get(code: string) {
    return this.prisma.machineMetadata.findUnique({ where: { machineCode: code } });
  }
}
