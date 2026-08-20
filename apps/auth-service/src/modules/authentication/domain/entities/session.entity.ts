export interface SessionProps {
  id: string;
  userId: string;
  ip: string;
  userAgent: string;
  expiredAt: Date | null;
  lastActivityAt: Date;
  createdAt: Date;
}

export class SessionEntity {
  constructor(private readonly props: SessionProps) {}

  static create(props: SessionProps): SessionEntity {
    const now = new Date();

    return new SessionEntity({
      id: props.id,
      userId: props.userId,
      ip: props.ip,
      userAgent: props.userAgent,
      expiredAt: props.expiredAt,
      lastActivityAt: props.lastActivityAt || now,
      createdAt: props.createdAt ?? now,
    });
  }

  get id(): string {
    return this.props.id;
  }

  get userId(): string {
    return this.props.userId;
  }

  get userAgent(): string {
    return this.props.userAgent;
  }

  get expriredAt(): Date | null {
    return this.props.expiredAt;
  }

  get lastActivityAt(): Date {
    return this.props.lastActivityAt;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }
}
