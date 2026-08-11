import { Injectable } from '@nestjs/common';
import type { JwtService } from '@nestjs/jwt';

import type {
  AccessTokenIssuer,
  AccessTokenPayload,
} from '@/modules/authentication/interfaces/access-token-issuer.interface';

@Injectable()
export class JwtAccessTokenIssuerService implements AccessTokenIssuer {
  constructor(private readonly jwtService: JwtService) {}

  async issue(payload: AccessTokenPayload): Promise<string> {
    return this.jwtService.signAsync({
      sub: payload.userId,
    });
  }
}
