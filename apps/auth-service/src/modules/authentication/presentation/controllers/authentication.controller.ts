import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import { Public } from '@/common/security/decorators/public.decorator';

import { LoginCommand } from '../../application/commands/login/login.command';
import type { LoginDto } from '../dtos/login.dto';

@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly commandBus: CommandBus) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    return this.commandBus.execute(new LoginCommand(loginDto.identifier, loginDto.password, '', ''));
  }
}
