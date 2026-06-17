import { ILogin, ILoginPayload, ILoginResponse } from '@libs/common';
import { PrismaService } from '@libs/database';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { Role, User } from 'generated/prisma';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  /** Handle JWT */
  verifyJWT(token: string): ILoginPayload {
    return this.jwtService.verify(token);
  }

  signJWT(payload: ILoginPayload): string {
    return this.jwtService.sign(payload);
  }

  /** Handle encode base64 email:password */
  encoded(token: string): ILogin {
    const [email, password] = Buffer.from(token, 'base64').toString('utf-8').split(':');
    return { email, password };
  }

  /** Handle hash password */
  hashPassword(password: string): string {
    return bcrypt.hashSync(password, 10);
  }

  comparePassword(password: string, hashPassword: string): boolean {
    return bcrypt.compareSync(password, hashPassword);
  }

  async verifyEmailPwd(email: string, password: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      return null;
    }

    if (!this.comparePassword(password, user.password)) {
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

    const accessToken = this.signJWT(payload);

    return { accessToken, payload };
  }

  /** Handle Permission */
  async getPermissions(userId: string) {
    return this.prisma.permission.findMany({ where: { userId } });
  }

  async checkPermission(userId: string, factoryId: string, role: Role) {
    const permission = await this.prisma.permission.findUniqueOrThrow({
      where: { userId_factoryId: { userId, factoryId } },
    });

    if (permission?.role === role) {
      return true;
    }

    return false;
  }

  async updatePermission(userId: string, factoryId: string, role: Role) {
    const _permission = { userId, factoryId, role };
    await this.prisma.permission.upsert({
      where: { userId_factoryId: { userId, factoryId } },
      create: _permission,
      update: _permission,
    });

    return true;
  }
}
