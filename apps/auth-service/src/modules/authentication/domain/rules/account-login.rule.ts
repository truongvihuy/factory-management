import { AuthenticationUser } from '../entities/authentication-user.entity';
import { AccountInactiveError } from '../errors/account-inactive.error';
import { AccountLockedError } from '../errors/account-locked.error';

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
