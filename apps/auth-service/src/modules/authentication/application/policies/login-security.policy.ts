import { AuthenticationUser } from '../../domain/entities/authentication-user.entity';
import type { AuthenticationContextRepositoryPort } from '../../domain/ports/authentication-context.port';
import type { LoginAttemptStorePort } from '../ports/login-attempt-store.port';

export interface LoginSecurityConfig {
  maxLoginAttempts: number;
  lockDurationMinutes: number;
}
export class LoginSecurityPolicy {
  constructor(
    private readonly repository: AuthenticationContextRepositoryPort,
    private readonly loginAttemptStore: LoginAttemptStorePort,
    private readonly config: LoginSecurityConfig,
  ) {}

  async handleFailedLogin(user: AuthenticationUser): Promise<void> {
    const attempts = await this.loginAttemptStore.incrementFailedAttempts(user.id);

    if (attempts < this.config.maxLoginAttempts) {
      return;
    }

    const lockedUntil = new Date(Date.now() + this.config.lockDurationMinutes * 60 * 1000);

    await this.repository.lockUser(user.id, lockedUntil);
  }

  async handleSuccessfulLogin(user: AuthenticationUser): Promise<void> {
    await this.loginAttemptStore.resetFailedAttempts(user.id);

    await this.repository.resetLoginSecurityState(user.id);

    await this.repository.updateLastLoginAt(user.id, new Date());
  }
}
