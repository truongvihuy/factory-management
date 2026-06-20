import { AuthHandleService } from '@libs/auth';
import type { IChangePassword, IForgotPassword, IResetPassword, IToken } from '@libs/common';
import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import type { Request } from 'express';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authHandleService: AuthHandleService,
    private readonly authService: AuthService,
  ) {}

  @Post('login')
  async login(@Body() payload: any) {
    const { email, password } = this.authHandleService.encoded(payload.token);
    const { ip, userAgent } = payload;
    return this.authService.login(email, password, ip, userAgent);
  }

  @Post('refresh-token')
  async refeshToken(@Body() payload: IToken) {
    return this.authService.refreshToken(payload.token);
  }

  @Post('logout')
  async logout(@Body() payload: any) {
    return this.authService.logout(payload.sessionId);
  }

  @Post('verify')
  async verify(@Body() payload: IToken) {
    return this.authHandleService.verifyJWT(payload.token);
  }

  @Post('change-password')
  async changePassword(@Req() req: Request, @Body() payload: IChangePassword) {
    const userId = (req as any).userId;

    return this.authService.changePassword(
      userId,
      payload.currentPassword,
      payload.newPassword,
      payload.exceptSessionId,
    );
  }

  @Post('forgot-password')
  async forgotPassword(@Body() payload: IForgotPassword) {
    return this.authService.forgotPassword(payload.email);
  }

  @Post('reset-password')
  async resetPassword(@Body() payload: IResetPassword) {
    return this.authService.resetPassword(payload.token, payload.newPassword);
  }

  @Get('session')
  async getSessions(@Req() req: Request) {
    const userId = (req as any).userId;
    return this.authService.getSessions(userId);
  }

  @Post('session/revorked/all/:sessionId')
  async revorkedAll(@Req() req: Request, @Param('sessionId') sessionId: string) {
    const userId = (req as any).userId;
    return this.authService.revokedAll(userId, sessionId);
  }

  @Get('session/reverked/:sessionId')
  async revorkedSession(@Param('sessionId') sessionId: string) {
    return this.authService.revoked(sessionId);
  }
}
