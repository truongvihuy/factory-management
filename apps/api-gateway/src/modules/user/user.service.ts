import type { AuthClientService } from '@libs/http-client';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  constructor(private readonly client: AuthClientService) {}
}
