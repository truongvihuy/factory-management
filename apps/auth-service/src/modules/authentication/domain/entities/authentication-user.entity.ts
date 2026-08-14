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
  lockedUntil: Date | null;
  lastLoginAt: Date | null;
}

export class AuthenticationUser {
  constructor(private readonly props: AuthenticationUserProps) {}

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
    return this.props.lockedUntil;
  }

  get lastLoginAt(): Date | null {
    return this.props.lastLoginAt;
  }

  isInactive(): boolean {
    return this.props.status === AuthenticationUserStatus.INACTIVE;
  }

  isLocked(): boolean {
    if (this.props.status !== AuthenticationUserStatus.LOCKED) {
      return false;
    }

    if (this.props.lockedUntil === null) {
      return true;
    }

    return this.props.lockedUntil.getTime() > Date.now();
  }
}
