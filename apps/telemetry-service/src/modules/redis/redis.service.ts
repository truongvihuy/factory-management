import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  public publisher: Redis;
  public subscriber: Redis;

  constructor() {
    this.publisher = new Redis({
      host: 'localhost',
      port: 6379,
    });

    this.subscriber = new Redis({
      host: 'localhost',
      port: 6379,
    });
  }
}
