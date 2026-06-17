import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';

import { Role } from 'generated/prisma';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  async getUser(@Param('id') id: string) {
    return this.userService.getUser(id);
  }

  @Post('')
  async createUser(@Body() dto: any) {
    return this.userService.createUser(dto);
  }

  @Put(':id')
  async updateUser(@Param('id') id: string, @Body() dto: any) {
    return this.userService.updateUser(id, dto);
  }

  @Get('admin-permission/:id')
  async checkAdmin(@Param('id') id: string) {
    return this.userService.checkAdmin(id);
  }

  @Post('admin-permission/:id/:admin')
  async updateAdmin(@Param('id') id: string, @Param('admin') admin: boolean) {
    return this.userService.updateAdmin(id, admin);
  }

  @Get('permission/:id')
  async getPemissions(@Param('id') id: string) {
    return this.userService.getPermissions(id);
  }

  @Get('permission/:userId/:factoryId/:role')
  async checkPermission(
    @Param('userId') userId: string,
    @Param('factoryId') factoryId: string,
    @Param('role') role: Role,
  ) {
    return this.userService.checkPermission(userId, factoryId, role);
  }

  @Get('permission/:userId/:factoryId')
  async getPermission(@Param('userId') userId: string, @Param('factoryId') factoryId: string) {
    return this.userService.getPermission(userId, factoryId);
  }

  @Post('permission/update/:userId/:factoryId/:role')
  async updatePermission(
    @Param('userId') userId: string,
    @Param('factoryId') factoryId: string,
    @Param('role') role: Role,
  ) {
    return this.userService.updatePermission(userId, factoryId, role);
  }

  @Delete('permission/delete/:userId/:factoryId')
  async deletePermission(@Param('userId') userId: string, @Param('factoryId') factoryId: string) {
    return this.userService.delelePermission(userId, factoryId);
  }
}
