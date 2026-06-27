import { AuthClient } from '@libs/clients/auth.client';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  constructor(private readonly client: AuthClient) {}
}
