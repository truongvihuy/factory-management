import { Injectable } from '@nestjs/common';
import { PrismaService } from 'libs/database';

@Injectable()
export class InternalBootstrapService {
  constructor(private readonly prisma: PrismaService) {}

  getMachines() {
    return this.prisma.machine.findMany();
  }

  getSensors() {
    return this.prisma.sensor.findMany();
  }
  getDevices() {
    return this.prisma.device.findMany();
  }
}
