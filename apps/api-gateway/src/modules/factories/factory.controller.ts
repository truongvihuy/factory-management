import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';

import { FactoryService } from './factory.service';

@Controller('factory')
export class FactoryController {
  constructor(private readonly factoryService: FactoryService) {}

  @Get()
  async getFactories() {}

  @Get(':id')
  async getFactory(@Param('id') id: string) {}

  @Post()
  async addFactory(@Body() body: any) {}

  @Put()
  async updateFactory(@Body() body: any) {}

  @Delete(':id')
  async deleteFactory(@Param() id: string) {}
}
