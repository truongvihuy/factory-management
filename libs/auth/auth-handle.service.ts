import { Injectable } from '@nestjs/common';
import { JwtService, JwtSignOptions, JwtVerifyOptions } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { ILogin } from 'libs/common';

@Injectable()
export class AuthHandleService {
  constructor(private readonly jwtService: JwtService) {}

  /** Handle JWT */
  signJWT<T extends object = any>(payload: T, options?: JwtSignOptions): string {
    return this.jwtService.sign(payload, options);
  }

  verifyJWT<T extends object = any>(token: string, options?: JwtVerifyOptions) {
    return this.jwtService.verify<T>(token, options) as T & { iat: number; exp: number };
  }

  /** Handle encode base64 email:password */
  encoded(token: string): ILogin {
    const [email, password] = Buffer.from(token, 'base64').toString('utf-8').split(':');
    return { email, password };
  }

  /** Handle hash password */
  hashPassword(password: string): string {
    return bcrypt.hashSync(password, 10);
  }

  comparePassword(password: string, hashPassword: string): boolean {
    return bcrypt.compareSync(password, hashPassword);
  }
}
