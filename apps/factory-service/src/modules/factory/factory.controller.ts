import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';

import { FactoryService } from './factory.service';

@Controller('factory')
export class FactoryController {
  constructor(private readonly factoryService: FactoryService) {}

  @Get('all')
  getFactoryListAll() {
    return this.factoryService.getFactoryListAll();
  }

  @Post('')
  async getFactoryListByIds(@Body() payload: any) {
    return this.factoryService.getFactoryListByIds(payload.factoryIds);
  }

  @Post('create')
  async addFactory(@Body() body: any) {}

  @Put(':factoryId')
  async updateFactory(@Param('factoryId') factoryId: string, @Body() body: any) {}

  @Delete(':factoryId')
  async deleteFactory(@Param('factoryId') factoryId: string) {}

  @Get(':factoryId/workshop')
  async getWorkshopInFactory(@Param('factoryId') factoryId: string) {}

  @Post(':factoryId/workshop')
  async addWorkshopInFactory(@Param('factoryId') factoryId: string, @Body() body: any) {}

  @Put(':factoryId/workshop/:workshopId')
  async updateWorkshopInFactory(
    @Param('factoryId') factoryId: string,
    @Param('workshopId') workshopId: string,
    @Body() body: any,
  ) {}

  @Delete(':factoryId/workshop/:workshopId')
  async deleteWorkshopInFactory(@Param('factoryId') factoryId: string, @Param('workshopId') workshopId: string) {}

  @Get(':factoryId/workshop/:workshopId/machine')
  async getMachine(@Param('factoryId') factoryId: string, @Param('workshopId') workshopId: string) {}

  @Post(':factoryId/workshop/:workshopId/machine')
  async addMachine(@Param('factoryId') factoryId: string, @Param('workshopId') workshopId: string, @Body() body: any) {}

  @Put(':factoryId/workshop/:workshopId/machine/:machineId')
  async updateMachine(
    @Param('factoryId') factoryId: string,
    @Param('workshopId') workshopId: string,
    @Param('machineId') machineId: string,
    @Body() body: any,
  ) {}

  @Delete(':factoryId/workshop/:workshopId/machine/:machineId')
  async deleteMachine(
    @Param('factoryId') factoryId: string,
    @Param('workshopId') workshopId: string,
    @Param('machineId') machineId: string,
  ) {}

  @Get(':factoryId/workshop/:workshopId/machine/:machineId/sensor')
  async getSensor(
    @Param('factoryId') factoryId: string,
    @Param('workshopId') workshopId: string,
    @Param('machineId') machineId: string,
  ) {}

  @Post(':factoryId/workshop/:workshopId/machine/:machineId/sensor')
  async addSensor(
    @Param('factoryId') factoryId: string,
    @Param('workshopId') workshopId: string,
    @Param('machineId') machineId: string,

    @Body() body: any,
  ) {}

  @Put(':factoryId/workshop/:workshopId/machine/:machineId/sensor/:sensorId')
  async updateSensor(
    @Param('factoryId') factoryId: string,
    @Param('workshopId') workshopId: string,
    @Param('machineId') machineId: string,
    @Param('sensorId') sensorId: string,
    @Body() body: any,
  ) {}

  @Delete(':factoryId/workshop/:workshopId/machine/:machineId/sensor/:sensorId')
  async deleteSensor(
    @Param('factoryId') factoryId: string,
    @Param('workshopId') workshopId: string,
    @Param('machineId') machineId: string,
    @Param('sensorId') sensorId: string,
  ) {}
}
