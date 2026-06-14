import { Body, Controller, Get, Post } from '@nestjs/common';

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
    return this.authService.verify(payload.token);
  }
}
