import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

import type { AuthenticationIdentifier } from '../interfaces/authentication.types';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  identifier!: AuthenticationIdentifier;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(1024)
  password!: string;
}
