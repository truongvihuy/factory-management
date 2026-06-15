import { PrismaService } from '@libs/database';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';

import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  verify(token: string) {
    return this.jwtService.verify(token);
  }

  encoded(token: string) {
    const [email, password] = Buffer.from(token, 'base64').toString('utf-8').split(':');
    return { email, password };
  }

  async verifyEmailPwd(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      return null;
    }

    if (!bcrypt.compareSync(password, user.password)) {
      return null;
    }

    return user;
  }

  async login(email: string, password: string) {
    const user = await this.verifyEmailPwd(email, password);

    if (!user) {
      throw new UnauthorizedException();
    }

    if (!user.status) {
      throw new UnauthorizedException();
    }

    const payload = {
      sub: user.id,
      email: user.email,
    };

    const accessToken = this.jwtService.sign(payload);

    return { accessToken, payload };
  }

  async register(dto: RegisterDto) {
    // const hashedPassword =
    //   await bcry.hash(
    //     dto.password,
    //     10,
    //   );
    // return this.prisma.user.create({
    //   data: {
    //     email: dto.email,
    //     password: hashedPassword,
    //   },
    // });
  }
  // refreshToken();

  // logout();

  // validateUser();

  // hashPassword();

  // comparePassword();
}
