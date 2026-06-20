import {
  CurrentUser,
  Public,
  RequestId,
  type IAccessTokenPayload,
  type IChangePassword,
  type IForgotPassword,
  type IResetPassword,
} from '@libs/common';
import { Body, Controller, Get, Ip, Param, Post, Req } from '@nestjs/common';
import type { Request } from 'express';

import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('profile')
  getProfile(@CurrentUser() user: IAccessTokenPayload, @RequestId() requestId: string) {
    return this.authService.getUser(user.sub, { requestId: requestId, userId: user.sub });
  }

  @Post('login')
  @Public()
  login(@Req() req: Request, @RequestId() requestId: string, @Ip() ip: string) {
    const user = (req as any).user;
    const userAgent = req.headers['user-agent'] ?? null;
    return this.authService.login({ basicToken: user.token, ip, userAgent }, { requestId });
  }

  @Post('refresh-token')
  @Public()
  refreshToken(@RequestId() requestId: string, @Body() payload: any) {
    return this.authService.refreshToken(payload.refreshToken, { requestId });
  }

  @Post('logout')
  logout(@CurrentUser() user: IAccessTokenPayload, @RequestId() requestId: string) {
    return this.authService.logout(user.sessionId, { requestId, userId: user.sub });
  }

  @Post('change-password')
  changePassword(
    @CurrentUser() user: IAccessTokenPayload,
    @RequestId() requestId: string,
    @Body() payload: IChangePassword,
  ) {
    payload.exceptSessionId = user.sessionId;
    return this.authService.changePassword(payload, { requestId, userId: user.sub });
  }

  @Post('forgot-password')
  @Public()
  forgotPassword(@Body() payload: IForgotPassword, @RequestId() requestId: string) {
    return this.authService.forgotPassword(payload, { requestId });
  }

  @Post('reset-password')
  @Public()
  resetPassword(@Body() payload: IResetPassword, @RequestId() requestId: string) {
    return this.authService.resetPassword(payload, { requestId });
  }

  @Get('session')
  getSession(@CurrentUser() user: IAccessTokenPayload, @RequestId() requestId: string) {
    return this.authService.getSessions({ userId: user.sub, requestId });
  }

  @Post('ression/revorked/all')
  revorkedAll(@CurrentUser() user: IAccessTokenPayload, @RequestId() requestId: string) {
    return this.authService.revorkedAll(user.sessionId, { userId: user.sub, requestId });
  }

  @Post('ression/revorked/:sessionId')
  revorked(
    @CurrentUser() user: IAccessTokenPayload,
    @RequestId() requestId: string,
    @Param('sessionId') sessionId: string,
  ) {
    return this.authService.revorked(sessionId, { userId: user.sub, requestId });
  }
}
