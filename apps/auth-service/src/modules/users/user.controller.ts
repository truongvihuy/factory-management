import { Body, Controller, Get, Param, Post } from '@nestjs/common';

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

  @Get('permission/check/:userId/:factoryId/:role')
  async checkPermission(
    @Param('userId') userId: string,
    @Param('factoryId') factoryId: string,
    @Param('role') role: Role,
  ) {
    return this.userService.checkPermission(userId, factoryId, role);
  }

  @Post('permission/update/:userId/:factoryId/:role')
  async updatePermission(
    @Param('userId') userId: string,
    @Param('factoryId') factoryId: string,
    @Param('role') role: Role,
  ) {
    return this.userService.checkPermission(userId, factoryId, role);
  }
}
