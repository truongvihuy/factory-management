import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class AuthClient {
  constructor(private readonly httpService: HttpService) {}
}
