import { CurrentUser, type IAccessTokenPayload, Permission, PermissionCode } from '@libs/common';
import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('')
  @Permission(PermissionCode.USER_READ)
  async getUserList(@CurrentUser() user: IAccessTokenPayload) {}

  @Get('/factory/:factoryId')
  @Permission(PermissionCode.USER_READ)
  async getUserListOfFactory(@Param('factoryId') factoryId: string, @CurrentUser() user: IAccessTokenPayload) {}

  @Post('')
  @Permission(PermissionCode.USER_CREATE)
  async createUser(@Body() userDTO: unknown) {}

  @Put(':userId')
  @Permission(PermissionCode.USER_UPDATE)
  async updateUser(@Param('userId') userId: string, @Body() userDTO: unknown) {}

  @Get(':userId/user-role')
  @Permission(PermissionCode.USER_UPDATE)
  async getUserRole(@Param('userId') userId: string) {}

  @Post(':userId/user-role')
  @Permission(PermissionCode.USER_UPDATE)
  async updateUserRole(@Param('userId') userId: string, @Body() payload: unknown) {}

  @Delete(':userId/user-role')
  @Permission(PermissionCode.USER_UPDATE)
  async deleteUserRole(@Param('userId') userId: string, @Body() payload: unknown) {}
}
