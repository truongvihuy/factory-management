import { Exceptions } from '@libs/common';
import type { PrismaService } from '@libs/database';
import { Injectable } from '@nestjs/common';
import type { Device, Factory, Machine, Sensor, Workshop } from '@prisma';

@Injectable()
export class FactoryService {
  constructor(private readonly prisma: PrismaService) {}

  private async validateOwnership(
    factoryId: string,
    workshopId: string,
    machineId?: string,
    sensorIdOrDeviceId?: string,
    type?: 'sensor' | 'device',
  ) {
    let result: unknown = null;

    if (sensorIdOrDeviceId) {
      switch (type) {
        case 'sensor': {
          result = await this.prisma.sensor.findFirst({
            where: {
              id: sensorIdOrDeviceId,
              machine: {
                workshop: {
                  factoryId,
                },
              },
            },
            select: { id: true },
          });
          break;
        }
        case 'device': {
          result = await this.prisma.device.findFirst({
            where: {
              id: sensorIdOrDeviceId,
              machine: {
                workshop: {
                  factoryId,
                },
              },
            },
            select: { id: true },
          });
        }
      }
    } else if (machineId) {
      result = await this.prisma.machine.findFirst({
        where: {
          id: machineId,
          workshop: {
            factoryId,
          },
        },
        select: { id: true },
      });
    } else {
      result = await this.prisma.workshop.findFirst({
        where: {
          id: workshopId,
          factoryId,
        },
        select: { id: true },
      });
    }

    if (!result) {
      Exceptions.factoryAccessDenied();
    }

    return !!result;
  }

  getFactoryListAll() {
    return this.prisma.factory.findMany({});
  }

  addFactory(payload: Factory) {
    return this.prisma.factory.create({
      data: payload,
    });
  }

  updateFactory(factoryId: string, payload: Factory) {
    return this.prisma.factory.update({
      where: { id: factoryId },
      data: payload,
    });
  }

  deleteFactory(factoryId: string) {
    return this.prisma.factory.delete({
      where: { id: factoryId },
    });
  }

  getWorkshopInFactory(factoryId: string) {
    return this.prisma.workshop.findMany({
      where: { factoryId },
    });
  }

  addWorkshopInFactory(factoryId: string, payload: Workshop) {
    payload.factoryId = factoryId;
    return this.prisma.workshop.create({
      data: payload,
    });
  }

  async updateWorkshopInFactory(factoryId: string, workshopId: string, payload: Workshop) {
    await this.validateOwnership(factoryId, workshopId);

    payload.factoryId = factoryId;
    return this.prisma.workshop.update({
      where: { id: workshopId },
      data: payload,
    });
  }

  async deleteWorkshopInFactory(factoryId: string, workshopId: string) {
    await this.validateOwnership(factoryId, workshopId);
    return this.prisma.workshop.delete({
      where: { id: workshopId },
    });
  }

  async getMachineInWorkshop(factoryId: string, workshopId: string) {
    await this.validateOwnership(factoryId, workshopId);
    return this.prisma.machine.findMany({ where: { workshopId } });
  }

  async addMachine(factoryId: string, workshopId: string, payload: Machine) {
    await this.validateOwnership(factoryId, workshopId);

    payload.workshopId = workshopId;
    return this.prisma.machine.create({
      data: payload,
    });
  }

  async updateMachine(factoryId: string, workshopId: string, machineId: string, payload: Machine) {
    await this.validateOwnership(factoryId, workshopId, machineId);

    payload.workshopId = workshopId;
    return this.prisma.machine.update({
      where: { id: machineId },
      data: payload,
    });
  }

  async deleteMachine(factoryId: string, workshopId: string, machineId: string) {
    await this.validateOwnership(factoryId, workshopId, machineId);

    return this.prisma.machine.delete({
      where: { id: machineId },
    });
  }

  async getSensor(factoryId: string, workshopId: string, machineId: string) {
    await this.validateOwnership(factoryId, workshopId, machineId);

    return this.prisma.sensor.findMany({
      where: { machineId },
    });
  }

  async addSensor(factoryId: string, workshopId: string, machineId: string, payload: Sensor) {
    await this.validateOwnership(factoryId, workshopId, machineId);

    payload.machineId = machineId;
    return this.prisma.sensor.create({
      data: payload,
    });
  }

  async updateSensor(factoryId: string, workshopId: string, machineId: string, sensorId: string, payload: Sensor) {
    await this.validateOwnership(factoryId, workshopId, machineId, sensorId, 'sensor');

    payload.machineId = machineId;
    return this.prisma.sensor.update({
      where: { id: sensorId },
      data: payload,
    });
  }

  async deleteSensor(factoryId: string, workshopId: string, machineId: string, sensorId: string) {
    await this.validateOwnership(factoryId, workshopId, machineId, sensorId, 'sensor');
    return this.prisma.sensor.delete({ where: { id: sensorId } });
  }

  async getDevice(factoryId: string, workshopId: string, machineId: string) {
    await this.validateOwnership(factoryId, workshopId, machineId);

    return this.prisma.device.findMany({
      where: { machineId },
    });
  }

  async addDevice(factoryId: string, workshopId: string, machineId: string, payload: Device) {
    await this.validateOwnership(factoryId, workshopId, machineId);

    payload.machineId = machineId;
    return this.prisma.device.create({
      data: payload,
    });
  }

  async updateDevice(factoryId: string, workshopId: string, machineId: string, deviceId: string, payload: Device) {
    await this.validateOwnership(factoryId, workshopId, machineId, deviceId, 'device');

    payload.machineId = machineId;
    return this.prisma.device.update({
      where: { id: deviceId },
      data: payload,
    });
  }

  async deleteDevice(factoryId: string, workshopId: string, machineId: string, deviceId: string) {
    await this.validateOwnership(factoryId, workshopId, machineId, deviceId, 'device');
    return this.prisma.device.delete({ where: { id: deviceId } });
  }
}
