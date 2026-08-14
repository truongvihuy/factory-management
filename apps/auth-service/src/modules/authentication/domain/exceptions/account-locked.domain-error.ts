export class AccountLockedDomainError extends Error {
  constructor(message = 'Account is locked') {
    super(message);
    this.name = AccountLockedDomainError.name;
  }
}
