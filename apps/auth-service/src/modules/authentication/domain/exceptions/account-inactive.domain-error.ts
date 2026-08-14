export class AccountInactiveDomainError extends Error {
  constructor(message = 'Account is inactive') {
    super(message);
    this.name = AccountInactiveDomainError.name;
  }
}
