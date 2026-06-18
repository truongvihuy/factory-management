import { PrismaService } from '@libs/database';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FactoryService {
  constructor(private readonly prisma: PrismaService) {}
}
