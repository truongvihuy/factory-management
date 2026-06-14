import { Controller } from '@nestjs/common';

import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {
    console.log('AuthController created');
  }

  // @Get('profile')
  // async getProfile() {}

  // @Post('login')
  // async login(@Body() loginDto: any) {}

  // @Post('register')
  // async register() {}

  // @Post('refesh-token')
  // async refeshToken() {}
}
