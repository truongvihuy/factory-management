import { Injectable } from '@nestjs/common';
import { AuthClient } from '../../clients/auth.client';

@Injectable()
export class UserService {
  constructor(private readonly client: AuthClient) {}
}
