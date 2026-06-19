import { AuthHandleService } from '@libs/auth';
import { DEFAULT, IAccessTokenPayload, ILoginResponse, IRefreshTokenPayload } from '@libs/common';
import { PrismaService } from '@libs/database';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from 'generated/prisma';
import ms from 'ms';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authHandleService: AuthHandleService,
    private readonly configService: ConfigService,
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

  async login(email: string, password: string, ip: string, userAgent: string): Promise<ILoginResponse> {
    const user = await this.verifyEmailPwd(email, password);

    if (!user) {
      throw new UnauthorizedException();
    }

    if (!user.status) {
      throw new UnauthorizedException();
    }

    const now = new Date();
    const SESSION_EXPIRATION = this.configService.get('SESSION_EXPIRATION', DEFAULT.SESSION_EXPIRATION);
    const expiredAt = SESSION_EXPIRATION ? new Date(+now + ms(SESSION_EXPIRATION)) : undefined;

    const session = await this.prisma.session.create({
      data: {
        ip,
        userAgent,
        userId: user.id,
        expiredAt,
        createdAt: now,
      },
    });

    const options = {
      secret: this.configService.get('JWT_REFRESH_SECRET', DEFAULT.JWT_REFRESH_SECRET),
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRATION', DEFAULT.JWT_REFRESH_EXPIRATION),
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.authHandleService.signJWT<IAccessTokenPayload>({
        sub: user.id,
        sessionId: session.id,
        email: user.email,
      }),
      this.authHandleService.signJWT<IRefreshTokenPayload>(
        {
          sub: user.id,
          sessionId: session.id,
        },
        options,
      ),
    ]);

    const refreshTokenData = this.authHandleService.verifyJWT<IRefreshTokenPayload>(refreshToken, options);
    const data = {
      sessionId: session.id,
      tokenHash: refreshToken,
      expiredAt: new Date(refreshTokenData.exp * 1000),
      createdAt: new Date(refreshTokenData.iat * 1000),
    };

    await this.prisma.refreshToken.upsert({
      where: { sessionId: session.id },
      create: data,
      update: data,
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(token: string) {
    const data = this.authHandleService.verifyJWT(token, {
      secret: this.configService.get('JWT_REFRESH_SECRET', DEFAULT.JWT_REFRESH_SECRET),
    });
  }

  async logout(sessionId: string) {}
}
