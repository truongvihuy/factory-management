import { Admin, Roles } from '@libs/common';
import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { Role } from 'generated/prisma';

import { AdminGuard } from '../../guards/admin.guard';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { RoleGuard } from '../../guards/role.guard';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Admin()
  @Get('')
  async getUserList() {
    //
  }

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.MANAGER)
  @Get(':factoryId')
  async getUserListOfFactory(@Param('factoryId') factoryId: string) {
    //
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Admin()
  @Post('')
  async createUser(@Body() userDTO: any) {
    // return this.userService.getPermission(userId);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Admin()
  @Put(':userId')
  async updateUser(@Param('userId') userId: string, @Body() userDTO: any) {
    // return this.userService.getPermission(userId);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Admin()
  @Get('permission/:userId')
  async getPemissions(@Param('userId') userId: string) {
    // return this.userService.getPermission(userId);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Admin()
  @Post('permission/:userId/:factoryId/:role')
  async updatePermission(
    @Param('userId') userId: string,
    @Param('factoryId') factoryId: string,
    @Param('role') role: Role,
  ) {
    // return this.userService.getPermission(userId);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Admin()
  @Delete('permission/:userId/:factoryId')
  async deletePermission(@Param('userId') userId: string, @Param('factoryId') factoryId: string) {
    // return this.userService.getPermission(userId);
  }
}
