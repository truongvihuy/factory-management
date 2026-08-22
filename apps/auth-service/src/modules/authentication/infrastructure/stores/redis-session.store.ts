import { Injectable } from '@nestjs/common';

import { RedisService } from '@/infrastructure/redis/redis.service';

import { SessionEntity } from '../../domain/entities';
import { SessionPayload, SessionStorePort } from '../../ports/outbound';

@Injectable()
export class RedisSessionStore implements SessionStorePort {
  constructor(private readonly _redisService: RedisService) {}

  async register(_payload: SessionPayload): Promise<SessionEntity> {
    return {} as SessionEntity;
  }

  async getSessionId(_sessionId: string): Promise<SessionEntity> {
    return {} as SessionEntity;
  }

  async revorked(_sessionId: string): Promise<void> {}
}
