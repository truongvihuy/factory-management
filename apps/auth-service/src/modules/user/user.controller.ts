import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { Role } from 'generated/prisma';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('')
  async getUsers() {
    return this.userService.getUserList();
  }

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

  @Get('role/admin/:userId')
  async checkAdmin(@Param('userId') userId: string) {
    return this.userService.checkAdmin(userId);
  }

  @Put('role/admin/:userId/:admin')
  async updateAdmin(@Param('userId') userId: string, @Param('admin') admin: boolean) {
    return this.userService.updateAdmin(userId, admin);
  }

  @Get('role/:userId')
  async getUserRoles(@Param('userId') userId: string) {
    return this.userService.getUserRoles(userId);
  }

  @Get('role/:userId/:factoryId/:role')
  async checkUserRole(
    @Param('userId') userId: string,
    @Param('factoryId') factoryId: string,
    @Param('role') role: Role,
  ) {
    return this.userService.checkUserRole(userId, factoryId, role);
  }

  @Get('role/:userId/:factoryId')
  async getRole(@Param('userId') userId: string, @Param('factoryId') factoryId: string) {
    return this.userService.getRole(userId, factoryId);
  }

  @Post('role/update/:userId/:factoryId/:role')
  async updateUserRole(
    @Param('userId') userId: string,
    @Param('factoryId') factoryId: string,
    @Param('role') role: Role,
  ) {
    return this.userService.updateUserRole(userId, factoryId, role);
  }

  @Delete('role/delete/:userId/:factoryId')
  async deleteUserRole(@Param('userId') userId: string, @Param('factoryId') factoryId: string) {
    return this.userService.deleteUserRole(userId, factoryId);
  }
}
