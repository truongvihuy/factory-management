import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import type {
  AccessTokenIssuer,
  AccessTokenPayload,
  AccessTokenResult,
} from '@/modules/authentication/interfaces/access-token-issuer.interface';

@Injectable()
export class JwtAccessTokenIssuerService implements AccessTokenIssuer {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async issue(payload: AccessTokenPayload): Promise<AccessTokenResult> {
    const accessToken = await this.jwtService.signAsync({
      sub: payload.userId,
    });

    const expiresIn = this.configService.getOrThrow<number>('authentication.token.accessTokenTtlSeconds');

    return {
      accessToken,
      expiresIn,
    };
  }
}
