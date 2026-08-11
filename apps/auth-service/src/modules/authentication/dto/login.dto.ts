import { IsNotEmpty, IsString, MinLength } from 'class-validator';

import type { AuthenticationIdentifier } from '../interfaces/authentication.types';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  identifier!: AuthenticationIdentifier;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password!: string;
}
