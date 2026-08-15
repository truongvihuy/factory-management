import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';

import { LoginUseCase } from '../../application/use-cases/login.use-case';
import type { LoginDto } from '../dto/login.dto';
import { AuthenticationExceptionMapper } from '../mappers/authentication-exception.mapper';

@Controller('auth')
export class AuthenticationController {
  constructor(private readonly loginUseCase: LoginUseCase) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    try {
      return await this.loginUseCase.execute(loginDto.identifier, loginDto.password);
    } catch (error: unknown) {
      throw AuthenticationExceptionMapper.map(error);
    }
  }
}
