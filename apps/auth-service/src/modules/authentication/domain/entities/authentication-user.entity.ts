export enum AuthenticationUserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  LOCKED = 'LOCKED',
}

export interface AuthenticationUserProps {
  id: string;
  username: string;
  email: string;
  displayName: string;
  passwordHash: string;
  status: AuthenticationUserStatus;
  lockedUntil?: Date | null;
  lastLoginAt?: Date | null;
}

export class AuthenticationUser {
  constructor(private readonly props: AuthenticationUserProps) {}

  static create(props: AuthenticationUserProps): AuthenticationUser {
    if (!props.id.trim()) {
      throw new Error('User id cannot be empty');
    }

    return new AuthenticationUser({
      id: props.id,
      username: props.username,
      email: props.email,
      displayName: props.displayName,
      passwordHash: props.passwordHash,
      status: props.status,
      lockedUntil: props.lockedUntil ?? null,
      lastLoginAt: props.lastLoginAt ?? null,
    });
  }

  get id(): string {
    return this.props.id;
  }

  get username(): string {
    return this.props.username;
  }

  get email(): string {
    return this.props.email;
  }

  get displayName(): string {
    return this.props.displayName;
  }

  get passwordHash(): string {
    return this.props.passwordHash;
  }

  get status(): AuthenticationUserStatus {
    return this.props.status;
  }

  get lockedUntil(): Date | null {
    return this.props.lockedUntil ?? null;
  }

  get lastLoginAt(): Date | null {
    return this.props.lastLoginAt ?? null;
  }

  isInactive(): boolean {
    return this.props.status === AuthenticationUserStatus.INACTIVE;
  }

  isLocked(): boolean {
    if (this.props.status !== AuthenticationUserStatus.LOCKED) {
      return false;
    }

    if (!this.props.lockedUntil) {
      return true;
    }

    return this.props.lockedUntil.getTime() > Date.now();
  }
}
