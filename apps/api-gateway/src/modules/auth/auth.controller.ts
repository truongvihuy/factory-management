import type { IAccessTokenPayload, IChangePassword, IForgotPassword, IResetPassword, IToken } from '@libs/common';
import { Body, Controller, Get, Ip, Post, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';

import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { LocalAuthGuard } from '../../guards/local-auth.guard';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req: Request) {
    const { user, requestId } = req as any as { user: IAccessTokenPayload; requestId: string };
    return this.authService.getUser(user.sub, { requestId: requestId, userId: user.sub });
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Req() req: Request, @Ip() ip: string) {
    const { user, requestId } = req as any as { user: IToken; requestId: string };
    const userAgent = req.headers['user-agent'] ?? null;
    return this.authService.login({ basicToken: user.token, ip, userAgent }, { requestId });
  }

  @Post('refresh-token')
  refreshToken(@Req() req: Request, @Body() payload: any) {
    const requestId = (req as any).requestId;
    return this.authService.refreshToken(payload.refreshToken, { requestId });
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  logout(@Req() req: Request) {
    const { user, requestId } = req as any as { user: IAccessTokenPayload; requestId: string };
    return this.authService.logout(user.sessionId, { requestId, userId: user.sub });
  }

  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  changePassword(@Req() req: Request, @Body() payload: IChangePassword) {
    const { user, requestId } = req as any as { user: IAccessTokenPayload; requestId: string };
    return this.authService.changePassword(payload, { requestId, userId: user.sub });
  }

  @Post('forgot-password')
  forgotPassword(@Req() req: Request, @Body() payload: IForgotPassword) {
    const requestId = (req as any).requestId;
    return this.authService.forgotPassword(payload, { requestId });
  }

  @Post('reset-password')
  resetPassword(@Req() req: Request, @Body() payload: IResetPassword) {
    const requestId = (req as any).requestId;
    return this.authService.resetPassword(payload, { requestId });
  }
}
