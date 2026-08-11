export class LoginUserDto {
  id!: string;
  username!: string;
  email!: string;
  displayName!: string;
}

export class LoginResponseDto {
  accessToken!: string;
  tokenType!: 'Bearer';
  expiresIn!: number;
  user!: LoginUserDto;
}
