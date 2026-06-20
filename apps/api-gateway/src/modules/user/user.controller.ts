import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';

import { Permission, PermissionCode } from '@libs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('')
  @Permission(PermissionCode.USER_READ)
  async getUserList() {
    //
  }

  @Get('/factory/:factoryId')
  @Permission(PermissionCode.USER_READ)
  async getUserListOfFactory(@Param('factoryId') factoryId: string) {
    //
  }

  @Post('')
  @Permission(PermissionCode.USER_CREATE)
  async createUser(@Body() userDTO: any) {
    // return this.userService.getPermission(userId);
  }

  @Put(':userId')
  @Permission(PermissionCode.USER_UPDATE)
  async updateUser(@Param('userId') userId: string, @Body() userDTO: any) {
    // return this.userService.getPermission(userId);
  }

  @Get('permission/:userId')
  @Permission(PermissionCode.USER_UPDATE)
  async getPemissions(@Param('userId') userId: string) {
    // return this.userService.getPermission(userId);
  }

  @Post('permission/:userId')
  @Permission(PermissionCode.USER_UPDATE)
  async updatePermission(@Param('userId') userId: string, @Body() payload: any) {
    // return this.userService.getPermission(userId);
  }

  @Delete('permission/:userId')
  @Permission(PermissionCode.USER_UPDATE)
  async deletePermission(@Param('userId') userId: string, @Body() payload: any) {
    // return this.userService.getPermission(userId);
  }
}
