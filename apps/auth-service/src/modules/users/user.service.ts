import { PrismaService } from '@libs/database';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getUser(userId: string) {
    return this.prisma.user.findUnique({ where: { id: userId } });
  }
  async create() {
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
}
