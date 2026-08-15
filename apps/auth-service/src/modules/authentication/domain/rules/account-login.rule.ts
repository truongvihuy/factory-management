import { AccountInactiveError } from '../domain-errors/account-inactive.error';
import { AccountLockedError } from '../domain-errors/account-locked.error';
import { AuthenticationUser } from '../entities/authentication-user.entity';

export class AccountLoginRule {
  static ensureCanLogin(user: AuthenticationUser): void {
    if (user.isInactive()) {
      throw new AccountInactiveError();
    }

    if (user.isLocked()) {
      throw new AccountLockedError();
    }
  }
}
