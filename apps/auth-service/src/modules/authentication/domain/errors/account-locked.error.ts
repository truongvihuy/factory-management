export class AccountLockedError extends Error {
  constructor(message = 'Account is locked') {
    super(message);
    this.name = AccountLockedError.name;
  }
}
