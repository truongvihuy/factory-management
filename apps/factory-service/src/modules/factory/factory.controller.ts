import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { FactoryService } from './factory.service';

@Controller('factory')
export class FactoryController {
  constructor(private readonly factoryService: FactoryService) {}

  @Get('all')
  getFactoryListAll() {
    return this.factoryService.getFactoryListAll();
  }

  @Post('create')
  async addFactory(@Body() body: any) {
    return this.factoryService.addFactory(body);
  }

  @Put(':factoryId')
  async updateFactory(@Param('factoryId') factoryId: string, @Body() body: any) {
    return this.factoryService.updateFactory(factoryId, body);
  }

  @Delete(':factoryId')
  async deleteFactory(@Param('factoryId') factoryId: string) {
    return this.factoryService.deleteFactory(factoryId);
  }

  @Get(':factoryId/workshop')
  async getWorkshopInFactory(@Param('factoryId') factoryId: string) {
    console.log({ factoryId });
    return this.factoryService.getWorkshopInFactory(factoryId);
  }

  @Post(':factoryId/workshop')
  async addWorkshopInFactory(@Param('factoryId') factoryId: string, @Body() body: any) {
    return this.factoryService.addWorkshopInFactory(factoryId, body);
  }

  @Put(':factoryId/workshop/:workshopId')
  async updateWorkshopInFactory(
    @Param('factoryId') factoryId: string,
    @Param('workshopId') workshopId: string,
    @Body() body: any,
  ) {
    return this.factoryService.updateWorkshopInFactory(factoryId, workshopId, body);
  }

  @Delete(':factoryId/workshop/:workshopId')
  async deleteWorkshopInFactory(@Param('factoryId') factoryId: string, @Param('workshopId') workshopId: string) {
    return this.factoryService.deleteWorkshopInFactory(factoryId, workshopId);
  }

  @Get(':factoryId/workshop/:workshopId/machine')
  async getMachineInWorkshop(@Param('factoryId') factoryId: string, @Param('workshopId') workshopId: string) {
    return this.factoryService.getMachineInWorkshop(factoryId, workshopId);
  }

  @Post(':factoryId/workshop/:workshopId/machine')
  async addMachine(@Param('factoryId') factoryId: string, @Param('workshopId') workshopId: string, @Body() body: any) {
    return this.factoryService.addMachine(factoryId, workshopId, body);
  }

  @Put(':factoryId/workshop/:workshopId/machine/:machineId')
  async updateMachine(
    @Param('factoryId') factoryId: string,
    @Param('workshopId') workshopId: string,
    @Param('machineId') machineId: string,
    @Body() body: any,
  ) {
    return this.factoryService.updateMachine(factoryId, workshopId, machineId, body);
  }

  @Delete(':factoryId/workshop/:workshopId/machine/:machineId')
  async deleteMachine(
    @Param('factoryId') factoryId: string,
    @Param('workshopId') workshopId: string,
    @Param('machineId') machineId: string,
  ) {
    return this.factoryService.deleteMachine(factoryId, workshopId, machineId);
  }

  @Get(':factoryId/workshop/:workshopId/machine/:machineId/sensor')
  async getSensor(
    @Param('factoryId') factoryId: string,
    @Param('workshopId') workshopId: string,
    @Param('machineId') machineId: string,
  ) {
    return this.factoryService.getSensor(factoryId, workshopId, machineId);
  }

  @Post(':factoryId/workshop/:workshopId/machine/:machineId/sensor')
  async addSensor(
    @Param('factoryId') factoryId: string,
    @Param('workshopId') workshopId: string,
    @Param('machineId') machineId: string,
    @Body() body: any,
  ) {
    return this.factoryService.addSensor(factoryId, workshopId, machineId, body);
  }

  @Put(':factoryId/workshop/:workshopId/machine/:machineId/sensor/:sensorId')
  async updateSensor(
    @Param('factoryId') factoryId: string,
    @Param('workshopId') workshopId: string,
    @Param('machineId') machineId: string,
    @Param('sensorId') sensorId: string,
    @Body() body: any,
  ) {
    return this.factoryService.updateSensor(factoryId, workshopId, machineId, sensorId, body);
  }

  @Delete(':factoryId/workshop/:workshopId/machine/:machineId/sensor/:sensorId')
  async deleteSensor(
    @Param('factoryId') factoryId: string,
    @Param('workshopId') workshopId: string,
    @Param('machineId') machineId: string,
    @Param('sensorId') sensorId: string,
  ) {
    return this.factoryService.deleteSensor(factoryId, workshopId, machineId, sensorId);
  }

  @Get(':factoryId/workshop/:workshopId/machine/:machineId/device')
  async getDevice(
    @Param('factoryId') factoryId: string,
    @Param('workshopId') workshopId: string,
    @Param('machineId') machineId: string,
  ) {
    return this.factoryService.getSensor(factoryId, workshopId, machineId);
  }

  @Post(':factoryId/workshop/:workshopId/machine/:machineId/device')
  async addDevice(
    @Param('factoryId') factoryId: string,
    @Param('workshopId') workshopId: string,
    @Param('machineId') machineId: string,
    @Body() body: any,
  ) {
    return this.factoryService.addSensor(factoryId, workshopId, machineId, body);
  }

  @Put(':factoryId/workshop/:workshopId/machine/:machineId/device/:deviceId')
  async updateDevice(
    @Param('factoryId') factoryId: string,
    @Param('workshopId') workshopId: string,
    @Param('machineId') machineId: string,
    @Param('deviceId') deviceId: string,
    @Body() body: any,
  ) {
    return this.factoryService.updateSensor(factoryId, workshopId, machineId, deviceId, body);
  }

  @Delete(':factoryId/workshop/:workshopId/machine/:machineId/device/:deviceId')
  async deleteDevice(
    @Param('factoryId') factoryId: string,
    @Param('workshopId') workshopId: string,
    @Param('machineId') machineId: string,
    @Param('deviceId') deviceId: string,
  ) {
    return this.factoryService.deleteSensor(factoryId, workshopId, machineId, deviceId);
  }
}
