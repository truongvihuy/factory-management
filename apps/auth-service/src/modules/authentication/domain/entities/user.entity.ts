export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  LOCKED = 'LOCKED',
}

export interface UserProps {
  id: string;
  username: string;
  email: string;
  displayName: string;
  passwordHash: string;
  status: UserStatus;
  lockedUntil?: Date | null;
  lastLoginAt?: Date | null;
}

export class UserEntity {
  constructor(private readonly props: UserProps) {}

  static create(props: UserProps): UserEntity {
    return new UserEntity({
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

  get status(): UserStatus {
    return this.props.status;
  }

  get lockedUntil(): Date | null {
    return this.props.lockedUntil ?? null;
  }

  get lastLoginAt(): Date | null {
    return this.props.lastLoginAt ?? null;
  }

  isInactive(): boolean {
    return this.props.status === UserStatus.INACTIVE;
  }

  isLocked(): boolean {
    if (this.props.status !== UserStatus.LOCKED) {
      return false;
    }

    if (!this.props.lockedUntil) {
      return true;
    }

    return this.props.lockedUntil.getTime() > Date.now();
  }
}
