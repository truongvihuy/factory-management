import { DEFAULT } from '@libs/common';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { AuthHandleService } from './auth-handle.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET', DEFAULT.JWT_SECRET),
        signOptions: {
          expiresIn: configService.get('JWT_EXPIRATION', DEFAULT.JWT_EXPIRATION),
        },
      }),
    }),
  ],
  providers: [AuthHandleService],
  exports: [AuthHandleService],
})
export class AuthHandleModule {}
