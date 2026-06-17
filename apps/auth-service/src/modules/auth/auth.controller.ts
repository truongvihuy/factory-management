import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { Role } from 'generated/prisma';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('profile')
  async getProfile() {}

  @Post('login')
  async login(@Body() payload: any) {
    const { email, password } = this.authService.encoded(payload.token);
    return this.authService.login(email, password);
  }

  @Post('verify')
  async verify(@Body() payload: any) {
    return this.authService.verifyJWT(payload.token);
  }

  @Get('permission/:id')
  async getPemissions(@Param('id') id: string) {
    return this.authService.getPermissions(id);
  }

  @Get('permission/check/:userId/:factoryId/:role')
  async checkPermission(
    @Param('userId') userId: string,
    @Param('factoryId') factoryId: string,
    @Param('role') role: Role,
  ) {
    return this.authService.checkPermission(userId, factoryId, role);
  }

  @Post('permission/update/:userId/:factoryId/:role')
  async updatePermission(
    @Param('userId') userId: string,
    @Param('factoryId') factoryId: string,
    @Param('role') role: Role,
  ) {
    return this.authService.checkPermission(userId, factoryId, role);
  }
}
