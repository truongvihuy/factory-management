import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('')
  async getUsers() {
    return this.userService.getUserList();
  }

  @Get('/factory/:factoryId')
  async getUserListOfFactory(@Param('factoryId') factoryId: string) {
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

  @Get(':userId/user-role')
  async getUserRoles(@Param('userId') userId: string) {
    return this.userService.getUserRoles(userId);
  }

  @Post(':userId/user-role')
  async updateUserRole(@Param('userId') userId: string, @Body() payload: any) {
    return this.userService.updateUserRole(userId, payload.factoryId, payload.role);
  }

  @Delete('/:userId/user-role')
  async deleteUserRole(@Param('userId') userId: string, @Body() payload: any) {
    return this.userService.deleteUserRole(userId, payload.factoryId);
  }
}
