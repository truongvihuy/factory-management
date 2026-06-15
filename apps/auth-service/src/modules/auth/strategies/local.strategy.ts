import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { BasicStrategy } from 'passport-http';

@Injectable()
export class LocalStrategy extends PassportStrategy(BasicStrategy, 'basic') {
  async validate(email: string, password: string) {
    console.log('LocalStrategy.validate', JSON.stringify({ email, password }));

    return {
      email,
      password,
    };
  }
}
