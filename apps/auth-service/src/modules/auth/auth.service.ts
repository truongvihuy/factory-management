import { AuthHandleService } from '@libs/auth';
import { ILoginPayload, ILoginResponse } from '@libs/common';
import { PrismaService } from '@libs/database';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from 'generated/prisma';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authHandleService: AuthHandleService,
  ) {}

  async verifyEmailPwd(email: string, password: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      return null;
    }

    if (!this.authHandleService.comparePassword(password, user.password)) {
      return null;
    }

    return user;
  }

  async login(email: string, password: string): Promise<ILoginResponse> {
    const user = await this.verifyEmailPwd(email, password);

    if (!user) {
      throw new UnauthorizedException();
    }

    if (!user.status) {
      throw new UnauthorizedException();
    }

    const permissions = await this.prisma.permission.findMany({
      where: { userId: user.id },
    });

    const payload: ILoginPayload = {
      sub: user.id,
      email: user.email,
      admin: user.admin,
      permissions,
    };

    const accessToken = this.authHandleService.signJWT(payload);

    return { accessToken, payload };
  }
}
