import { PrismaService } from '@libs/database';
import { Injectable } from '@nestjs/common';
import { Factory, Machine, Sensor, Workshop } from 'generated/prisma';

@Injectable()
export class FactoryService {
  constructor(private readonly prisma: PrismaService) {}

  private async _checkMachineInValid(factoryId: string, workshopId: string, machineId?: string, sensorId?: string) {
    const result = await this.prisma.factory.findUnique({
      where: { id: factoryId },
      include: {
        workshops: {
          where: { id: workshopId },
          select: { id: true },
          include: machineId
            ? {
                machines: {
                  where: { id: machineId },
                  select: { id: true },
                  include: sensorId
                    ? {
                        sensors: {
                          where: { id: sensorId },
                          select: { id: true },
                        },
                      }
                    : null,
                },
              }
            : null,
        },
      },
    });

    console.log(result);
  }

  getFactoryListByIds(factoryIds: string[]) {
    return this.prisma.factory.findMany({ where: { id: { in: factoryIds } } });
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
    const valid = await this._checkMachineInValid(factoryId, workshopId);

    payload.factoryId = factoryId;
    return this.prisma.workshop.update({
      where: { id: workshopId },
      data: payload,
    });
  }

  async deleteWorkshopInFactory(factoryId: string, workshopId: string) {
    const valid = await this._checkMachineInValid(factoryId, workshopId);
    return this.prisma.workshop.delete({
      where: { id: workshopId },
    });
  }

  async getMachine(factoryId: string, workshopId: string) {
    const valid = await this._checkMachineInValid(factoryId, workshopId);
    return this.prisma.machine.findMany({ where: { workshopId } });
  }

  async addMachine(factoryId: string, workshopId: string, payload: Machine) {
    const valid = await this._checkMachineInValid(factoryId, workshopId);

    payload.workshopId = workshopId;
    return this.prisma.machine.create({
      data: payload,
    });
  }

  async updateMachine(factoryId: string, workshopId: string, machineId: string, payload: Machine) {
    const valid = await this._checkMachineInValid(factoryId, workshopId, machineId);

    payload.workshopId = workshopId;
    return this.prisma.machine.update({
      where: { id: machineId },
      data: payload,
    });
  }

  async deleteMachine(factoryId: string, workshopId: string, machineId: string) {
    const valid = await this._checkMachineInValid(factoryId, workshopId, machineId);

    return this.prisma.machine.delete({
      where: { id: machineId },
    });
  }

  async getSensor(factoryId: string, workshopId: string, machineId: string) {
    const valid = await this._checkMachineInValid(factoryId, workshopId, machineId);

    return this.prisma.sensor.findMany({
      where: { machineId },
    });
  }

  async addSensor(factoryId: string, workshopId: string, machineId: string, payload: Sensor) {
    const valid = await this._checkMachineInValid(factoryId, workshopId, machineId);

    payload.machineId = machineId;
    return this.prisma.sensor.create({
      data: payload,
    });
  }

  async updateSensor(factoryId: string, workshopId: string, machineId: string, sensorId: string, payload: Sensor) {
    const valid = await this._checkMachineInValid(factoryId, workshopId, machineId, sensorId);

    payload.machineId = machineId;
    return this.prisma.sensor.update({
      where: { id: sensorId },
      data: payload,
    });
  }

  async deleteSensor(factoryId: string, workshopId: string, machineId: string, sensorId: string) {
    const valid = await this._checkMachineInValid(factoryId, workshopId, machineId, sensorId);
    return this.prisma.sensor.delete({ where: { id: sensorId } });
  }
}
