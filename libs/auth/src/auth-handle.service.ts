import { ILogin, ILoginPayload } from '@libs/common';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';

@Injectable()
export class AuthHandleService {
  constructor(private readonly jwtService: JwtService) {}

  /** Handle JWT */
  verifyJWT(token: string): ILoginPayload {
    return this.jwtService.verify(token);
  }

  signJWT(payload: ILoginPayload): string {
    return this.jwtService.sign(payload);
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
