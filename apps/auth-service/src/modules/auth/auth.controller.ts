import { Body, Controller, Get, Post } from '@nestjs/common';

import { AuthHandleService } from '@libs/auth';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authHandleService: AuthHandleService,
    private readonly authService: AuthService,
  ) {}

  @Get('profile')
  async getProfile() {}

  @Post('login')
  async login(@Body() payload: any) {
    const { email, password } = this.authHandleService.encoded(payload.basicToken);
    const { ip, userAgent } = payload;
    return this.authService.login(email, password, ip, userAgent);
  }

  @Post('refesh-token')
  async refeshToken(@Body() payload: any) {
    return this.authService.refreshToken(payload.refreshToken);
  }

  @Post('logout')
  async logout(@Body() payload: any) {
    return this.authService.logout(payload.sessionId);
  }

  @Post('verify')
  async verify(@Body() payload: any) {
    return this.authHandleService.verifyJWT(payload.token);
  }
}
