import { AuthenticationUser } from '../entities/authentication-user.entity';
import { AccountInactiveDomainError } from '../exceptions/account-inactive.domain-error';
import { AccountLockedDomainError } from '../exceptions/account-locked.domain-error';

export class AccountLoginRule {
  static ensureCanLogin(user: AuthenticationUser): void {
    if (user.isInactive()) {
      throw new AccountInactiveDomainError();
    }

    if (user.isLocked()) {
      throw new AccountLockedDomainError();
    }
  }
}
