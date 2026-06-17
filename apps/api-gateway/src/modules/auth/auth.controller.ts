import { ILoginPayload, ILoginToken } from '@libs/common';
import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { LocalAuthGuard } from '../../guards/local-auth.guard';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Req() req: Request) {
    const { user, requestId } = req as any as { user: ILoginPayload; requestId: string };
    return this.authService.getUser(user.sub, { requestId: requestId, userId: user.sub });
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(@Req() req: Request) {
    const { user, requestId } = req as any as { user: ILoginToken; requestId: string };
    return this.authService.login(user.token, { requestId });
  }

  @Post('refesh-token')
  async refeshToken() {}
}
