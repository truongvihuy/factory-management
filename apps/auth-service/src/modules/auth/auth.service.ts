import { AuthHandleService } from '@libs/auth';
import { DEFAULT, IAccessTokenPayload, ILoginResponse, IRefreshTokenPayload } from '@libs/common';
import { PrismaService } from '@libs/database';
import { ConflictException, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { differenceInDays } from 'date-fns';
import { Prisma, Session, User } from 'generated/prisma';
import ms from 'ms';
import { randomBytes } from 'node:crypto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authHandleService: AuthHandleService,
    private readonly configService: ConfigService,
  ) {}

  async login(email: string, password: string, ip: string, userAgent: string): Promise<ILoginResponse> {
    const user = await this._checkEmailPassword(email, password);

    const now = new Date();
    const SESSION_EXPIRATION = this.configService.get('SESSION_EXPIRATION', DEFAULT.SESSION_EXPIRATION);
    const expiredAt = SESSION_EXPIRATION ? new Date(+now + ms(SESSION_EXPIRATION)) : undefined;

    const session = await this.prisma.session.create({
      data: {
        ip,
        userAgent,
        userId: user.id,
        expiredAt,
        revokedAt: null,
        createdAt: now,
      },
    });

    return this._createAccessTokenAndRefreshToken(user, session);
  }

  async refreshToken(token: string) {
    const data = this.authHandleService.verifyJWT<IRefreshTokenPayload>(token, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET', DEFAULT.JWT_REFRESH_SECRET),
    });

    const [session, user] = await Promise.all([
      this._checkSession(data.sessionId),
      this._checkUser(data.sub),
      this._checkRefreshToken(data.sessionId, token),
    ]);

    await this.prisma.session.update({
      where: { id: session.id },
      data: { lastActivityAt: new Date() },
    });

    return this._createAccessTokenAndRefreshToken(user, session);
  }

  async logout(sessionId: string) {
    await this.prisma.session.update({
      where: { id: sessionId },
      data: { revokedAt: new Date() },
    });

    return true;
  }

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
    exceptSessionId?: string | undefined,
  ) {
    await this._checkEmailPassword(userId, currentPassword);
    return this._changePasswordAndRevorkedAll(userId, newPassword, exceptSessionId);
  }

  async forgotPassword(email: string) {
    const user = await this._checkUser(email);
    const resetToken = await this._createResetToken(user);
    // Send mail

    return true;
  }

  async resetPassword(token: string, newPassword: string) {
    const userId = await this._checkResetToken(token);
    const user = await this._checkUser(userId);
    // Handle create token and send mail

    return this._changePasswordAndRevorkedAll(userId, newPassword);
  }

  async getSessions(userId: string) {
    return this.prisma.session.findMany({
      where: { userId, revokedAt: null },
    });
  }

  async revoked(sessionId: string) {
    await this.prisma.session.update({
      where: { id: sessionId },
      data: { revokedAt: new Date() },
    });
    return true;
  }

  async revokedAll(userId: string, exceptSessionId?: string | undefined) {
    let query: Prisma.SessionWhereInput = { userId };
    if (exceptSessionId) {
      query.id = { not: exceptSessionId } as Prisma.StringFilter;
    }
    await this.prisma.session.updateMany({
      where: query,
      data: { revokedAt: new Date() },
    });
    return true;
  }

  private async _checkEmailPassword(emailOrUserId: string, password: string): Promise<User> {
    const user = await this.prisma.user.findFirst({
      where: { OR: [{ id: emailOrUserId }, { email: emailOrUserId }] },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    if (!this.authHandleService.comparePassword(password, user.password)) {
      throw new UnauthorizedException();
    }

    if (!user.status) {
      throw new UnauthorizedException();
    }

    return user;
  }

  private async _checkRefreshToken(sessionId: string, token: string) {
    const refTokenData = await this.prisma.refreshToken.findFirst({ where: { sessionId: sessionId } });

    if (refTokenData?.tokenHash !== token) {
      throw new ConflictException();
    }

    return refTokenData;
  }

  private async _checkResetToken(token: string) {
    // Get DB check
    const userId = '';

    return userId;
  }

  private async _checkSession(sessionId: string) {
    const session = await this.prisma.session.findUnique({ where: { id: sessionId } });
    if (!session) {
      throw new ConflictException();
    }

    if (session.revokedAt) {
      throw new ConflictException();
    }

    const now = new Date();

    if (session.expiredAt && +session.expiredAt < +now) {
      await this.prisma.session.update({
        where: { id: session.id },
        data: { revokedAt: session.expiredAt },
      });
      throw new ConflictException();
    }

    const idleDays = differenceInDays(now, session.lastActivityAt);
    if (idleDays > DEFAULT.MAX_IDLE_DAYS) {
      await this.prisma.session.update({
        where: { id: session.id },
        data: { revokedAt: now },
      });
      throw new ConflictException();
    }

    return session;
  }

  private async _checkUser(userIdOrEmail: string) {
    const user = await this.prisma.user.findFirst({
      where: { OR: [{ id: userIdOrEmail }, { email: userIdOrEmail }] },
    });
    if (!user) {
      throw new ForbiddenException();
    }

    return user;
  }

  private async _createAccessTokenAndRefreshToken(user: User, session: Session) {
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

  private async _createResetToken(user: User) {
    const token = randomBytes(32).toString('hex');
    const tokenHash = bcrypt.hash(token, 10);

    // Save DB

    return tokenHash;
  }

  private async _changePasswordAndRevorkedAll(
    userId: string,
    newPassword: string,
    exceptSessionId?: string | undefined,
  ) {
    await Promise.all([
      this.prisma.user.update({
        where: { id: userId },
        data: { password: this.authHandleService.hashPassword(newPassword) },
      }),
      this.revokedAll(userId, exceptSessionId),
    ]);

    return true;
  }
}
