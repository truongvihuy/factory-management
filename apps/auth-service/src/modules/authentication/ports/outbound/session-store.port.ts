import { SessionEntity } from '../../domain/entities/session.entity';

export interface SessionPayload {
  userId: string;
  ip: string;
  userAgent: string;
  expiredAt?: Date | null;
}

export interface SessionStorePort {
  register(payload: SessionPayload): Promise<SessionEntity>;

  getSessionId(sessionId: string): Promise<SessionEntity>;

  revorked(sessionId: string): Promise<void>;
}
