import { PrismaService } from '@libs/database';
import { Injectable } from '@nestjs/common';

@Injectable()
export class InternalBootstrapService {
  constructor(private readonly prisma: PrismaService) {}
}
