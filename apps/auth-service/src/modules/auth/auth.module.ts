import { DEFAULT } from '@libs/common';
import { PrismaModule } from '@libs/database';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    PrismaModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET', DEFAULT.JWT_SECRET),
        signOptions: {
          expiresIn: config.get<number>('JWT_EXPIRATION', DEFAULT.JWT_EXPIRATION),
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
