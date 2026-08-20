import { Injectable } from '@nestjs/common';

import { RedisService } from '@/infrastructure/redis/redis.service';

import { SessionEntity } from '../../domain/entities/session.entity';
import { SessionPayload, SessionStorePort } from '../../ports/outbound';

@Injectable()
export class RedisSessionStore implements SessionStorePort {
  constructor(private readonly redisService: RedisService) {}

  async register(payload: SessionPayload): Promise<SessionEntity> {
    return {} as SessionEntity;
  }

  async getSessionId(sessionId: string): Promise<SessionEntity> {
    return {} as SessionEntity;
  }

  async revorked(sessionId: string): Promise<void> {}
}
