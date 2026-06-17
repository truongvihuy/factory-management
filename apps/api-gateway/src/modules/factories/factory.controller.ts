import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';

import { AdminGuard } from '../../guards/admin.guard';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { FactoryService } from './factory.service';

@Controller('factory')
export class FactoryController {
  constructor(private readonly factoryService: FactoryService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getFactories(@Req() req: Request) {}

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getFactory(@Param('id') id: string) {}

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  async addFactory(@Body() body: any) {}

  @Put()
  async updateFactory(@Body() body: any) {}

  @Delete(':id')
  async deleteFactory(@Param() id: string) {}
}
