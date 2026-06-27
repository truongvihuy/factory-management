import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { differenceInDays } from 'date-fns';
import { Prisma, Session, User } from 'generated/prisma';
import { AuthHandleService } from 'libs/auth';
import {
  DEFAULT,
  Exceptions,
  IAccessTokenPayload,
  ICheckUserRole,
  ILoginResponse,
  IRefreshTokenPayload,
  ROLE_PERMISSIONS,
} from 'libs/common';
import { PrismaService } from 'libs/database';
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
    const user = await this.validateEmailPassword(email, password);

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
      this.validateSession(data.sessionId),
      this.validateUser(data.sub),
      this.validateRefreshToken(data.sessionId, token),
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
    await this.validateEmailPassword(userId, currentPassword);
    return this._changePasswordAndRevorkedAll(userId, newPassword, exceptSessionId);
  }

  async forgotPassword(email: string) {
    const user = await this.validateUser(email);
    const resetToken = await this._createResetToken(user);
    // Send mail

    return true;
  }

  async resetPassword(token: string, newPassword: string) {
    const userId = await this.validateResetToken(token);
    const user = await this.validateUser(userId);
    // Handle create token and send mail

    return this._changePasswordAndRevorkedAll(userId, newPassword);
  }

  async checkUserRole(data: ICheckUserRole) {
    const user = await this.validateUser(data.userId);
    let hasPermission = false;
    if (user.admin) {
      hasPermission = ROLE_PERMISSIONS.ADMIN.includes(data.permission);
      if (hasPermission) {
        return true;
      }
    }

    if (data.factoryId) {
      const userRole = await this.prisma.userRole.findUnique({
        where: {
          userId_factoryId: {
            userId: data.userId,
            factoryId: data.factoryId,
          },
        },
      });

      if (userRole) {
        return ROLE_PERMISSIONS[userRole.role].includes(data.permission);
      }
    }

    return false;
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

  private async validateEmailPassword(emailOrUserId: string, password: string): Promise<User> {
    const user = await this.validateUser(emailOrUserId);

    if (!this.authHandleService.comparePassword(password, user.password)) {
      Exceptions.invalidCredetials();
    }

    return user;
  }

  private async validateRefreshToken(sessionId: string, token: string) {
    const refTokenData = await this.prisma.refreshToken.findFirst({ where: { sessionId: sessionId } });

    if (refTokenData?.tokenHash !== token) {
      Exceptions.invalidToken();
    }

    return refTokenData;
  }

  private async validateResetToken(token: string) {
    // Get DB check
    const userId = '';

    return userId;
  }

  private async validateSession(sessionId: string) {
    const session = await this.prisma.session.findUnique({ where: { id: sessionId } });
    if (!session) {
      Exceptions.sessionNotFound();
    }

    if (session.revokedAt) {
      Exceptions.sessionRevorked();
    }

    const now = new Date();

    if (session.expiredAt && +session.expiredAt < +now) {
      await this.prisma.session.update({
        where: { id: session.id },
        data: { revokedAt: session.expiredAt },
      });

      Exceptions.sessionRevorked();
    }

    const idleDays = differenceInDays(now, session.lastActivityAt);
    if (idleDays > DEFAULT.MAX_IDLE_DAYS) {
      await this.prisma.session.update({
        where: { id: session.id },
        data: { revokedAt: now },
      });

      Exceptions.sessionRevorked();
    }

    return session;
  }

  private async validateUser(userIdOrEmail: string) {
    const user = await this.prisma.user.findFirst({
      where: { OR: [{ id: userIdOrEmail }, { email: userIdOrEmail }] },
    });
    if (!user) {
      Exceptions.invalidCredetials();
    }

    if (!user.status) {
      Exceptions.authBlocked();
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
