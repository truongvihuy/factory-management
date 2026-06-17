import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';

import { Role } from 'generated/prisma';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('')
  async getUsers() {}

  @Get(':userId')
  async getUser(@Param('userId') userId: string) {
    return this.userService.getUser(userId);
  }

  @Post('')
  async createUser(@Body() dto: any) {
    return this.userService.createUser(dto);
  }

  @Put(':userId')
  async updateUser(@Param('userId') userId: string, @Body() dto: any) {
    return this.userService.updateUser(userId, dto);
  }

  @Get('admin-permission/:userId')
  async checkAdmin(@Param('userId') userId: string) {
    return this.userService.checkAdmin(userId);
  }

  @Post('admin-permission/:userId/:admin')
  async updateAdmin(@Param('userId') userId: string, @Param('admin') admin: boolean) {
    return this.userService.updateAdmin(userId, admin);
  }

  @Get('permission/:userId')
  async getPemissions(@Param('userId') userId: string) {
    return this.userService.getPermissions(userId);
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
