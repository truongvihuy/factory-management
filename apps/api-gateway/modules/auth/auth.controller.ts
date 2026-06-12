import { Body, Controller, Get, Post } from '@nestjs/common';

import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('profile')
  async getProfile() {}

  @Post('login')
  async login(@Body() loginDto) {}

  @Post('register')
  async register() {}

  @Post('refesh-token')
  async refeshToken() {}
}
