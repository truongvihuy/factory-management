import { PrismaService } from '@libs/database';
import { Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async login(dto: LoginDto) {}

  async verify(token: string) {}

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
