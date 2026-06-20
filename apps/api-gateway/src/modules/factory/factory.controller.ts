import { IAccessTokenPayload, Permission, PermissionCode } from '@libs/common';
import { Body, Controller, Delete, Get, Param, Post, Put, Req } from '@nestjs/common';
import type { Request } from 'express';

import { FactoryService } from './factory.service';

@Controller('factory')
export class FactoryController {
  constructor(private readonly factoryService: FactoryService) {}

  @Get('all')
  @Permission(PermissionCode.FACTORY_READ)
  getFactoryListAll(@Req() req: Request) {
    const { user, requestId } = req as any as { user: IAccessTokenPayload; requestId: string };

    return this.factoryService.getFactoryListAll({ requestId, userId: user.sub });
  }

  @Get(':factoryId')
  @Permission(PermissionCode.FACTORY_READ)
  async getFactory(@Param('factoryId') factoryId: string) {}

  @Post()
  @Permission(PermissionCode.FACTORY_CREATE)
  async addFactory(@Body() body: any) {}

  @Put(':factoryId')
  @Permission(PermissionCode.FACTORY_UPDATE)
  async updateFactory(@Param('factoryId') factoryId: string, @Body() body: any) {}

  @Delete(':factoryId')
  @Permission(PermissionCode.FACTORY_DELETE)
  async deleteFactory(@Param('factoryId') factoryId: string) {}

  @Get(':factoryId/workshop')
  @Permission(PermissionCode.WORKSHOP_READ)
  async getWorkshopInFactory(@Param('factoryId') factoryId: string) {}

  @Post(':factoryId/workshop')
  @Permission(PermissionCode.WORKSHOP_CREATE)
  async addWorkshopInFactory(@Param('factoryId') factoryId: string, @Body() body: any) {}

  @Put(':factoryId/workshop/:workshopId')
  @Permission(PermissionCode.WORKSHOP_UPDATE)
  async updateWorkshopInFactory(
    @Param('factoryId') factoryId: string,
    @Param('workshopId') workshopId: string,
    @Body() body: any,
  ) {}

  @Delete(':factoryId/workshop/:workshopId')
  @Permission(PermissionCode.WORKSHOP_DELETE)
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
