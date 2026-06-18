import { Admin, Roles } from '@libs/common';
import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { Permission, Role } from 'generated/prisma';

import { AdminGuard } from '../../guards/admin.guard';
import { FactoryGuard } from '../../guards/factory.guard';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { RoleGuard } from '../../guards/role.guard';
import { FactoryService } from './factory.service';

@Controller('factory')
export class FactoryController {
  constructor(private readonly factoryService: FactoryService) {}

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Admin()
  @Get('all')
  getFactoryListAll() {
    // return this.factoryService.getFactoryListAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getFactoryListByIds(@Req() req: any) {
    const permissions: Permission[] = req.user.permission;
    const factoryIds = permissions.map((per) => per.factoryId);

    // return this.factoryService.getFactoryListByIds(factoryIds);
  }

  @UseGuards(JwtAuthGuard, FactoryGuard)
  @Get(':factoryId')
  async getFactory(@Param('factoryId') factoryId: string) {}

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Admin()
  @Post()
  async addFactory(@Body() body: any) {}

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Admin()
  @Put(':factoryId')
  async updateFactory(@Param('factoryId') factoryId: string, @Body() body: any) {}

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Admin()
  @Delete(':factoryId')
  async deleteFactory(@Param('factoryId') factoryId: string) {}

  @UseGuards(JwtAuthGuard, FactoryGuard)
  @Get(':factoryId/workshop')
  async getWorkshopInFactory(@Param('factoryId') factoryId: string) {}

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.MANAGER)
  @Post(':factoryId/workshop')
  async addWorkshopInFactory(@Param('factoryId') factoryId: string, @Body() body: any) {}

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.MANAGER)
  @Put(':factoryId/workshop/:workshopId')
  async updateWorkshopInFactory(
    @Param('factoryId') factoryId: string,
    @Param('workshopId') workshopId: string,
    @Body() body: any,
  ) {}

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.MANAGER)
  @Delete(':factoryId/workshop/:workshopId')
  async deleteWorkshopInFactory(@Param('factoryId') factoryId: string, @Param('workshopId') workshopId: string) {}

  @UseGuards(JwtAuthGuard, FactoryGuard)
  @Get(':factoryId/workshop/:workshopId/machine')
  async getMachine(@Param('factoryId') factoryId: string, @Param('workshopId') workshopId: string) {}

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.MANAGER)
  @Post(':factoryId/workshop/:workshopId/machine')
  async addMachine(@Param('factoryId') factoryId: string, @Param('workshopId') workshopId: string, @Body() body: any) {}

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.MANAGER)
  @Put(':factoryId/workshop/:workshopId/machine/:machineId')
  async updateMachine(
    @Param('factoryId') factoryId: string,
    @Param('workshopId') workshopId: string,
    @Param('machineId') machineId: string,
    @Body() body: any,
  ) {}

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.MANAGER)
  @Delete(':factoryId/workshop/:workshopId/machine/:machineId')
  async deleteMachine(
    @Param('factoryId') factoryId: string,
    @Param('workshopId') workshopId: string,
    @Param('machineId') machineId: string,
  ) {}

  @UseGuards(JwtAuthGuard, FactoryGuard)
  @Get(':factoryId/workshop/:workshopId/machine/:machineId/sensor')
  async getSensor(
    @Param('factoryId') factoryId: string,
    @Param('workshopId') workshopId: string,
    @Param('machineId') machineId: string,
  ) {}

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.MANAGER)
  @Post(':factoryId/workshop/:workshopId/machine/:machineId/sensor')
  async addSensor(
    @Param('factoryId') factoryId: string,
    @Param('workshopId') workshopId: string,
    @Param('machineId') machineId: string,

    @Body() body: any,
  ) {}

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.MANAGER)
  @Put(':factoryId/workshop/:workshopId/machine/:machineId/sensor/:sensorId')
  async updateSensor(
    @Param('factoryId') factoryId: string,
    @Param('workshopId') workshopId: string,
    @Param('machineId') machineId: string,
    @Param('sensorId') sensorId: string,
    @Body() body: any,
  ) {}

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.MANAGER)
  @Delete(':factoryId/workshop/:workshopId/machine/:machineId/sensor/:sensorId')
  async deleteSensor(
    @Param('factoryId') factoryId: string,
    @Param('workshopId') workshopId: string,
    @Param('machineId') machineId: string,
    @Param('sensorId') sensorId: string,
  ) {}
}
