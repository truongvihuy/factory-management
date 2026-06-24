import { Injectable } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class WsService {
  constructor(private readonly redisService: RedisService) {}
}
