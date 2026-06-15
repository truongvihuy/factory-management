import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly config: ConfigService) {
    const JWT_SECRET = config.get<string>('JWT_SECRET') ?? '';

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: JWT_SECRET,
    });
  }

  async validate(payload: any) {
    console.log('JwtStrategy.validate' + JSON.stringify(payload));
    return payload;
  }
}
