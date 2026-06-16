import { Body, Controller, Get, Param, Post } from '@nestjs/common';

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
    return this.userService.create();
  }
}
