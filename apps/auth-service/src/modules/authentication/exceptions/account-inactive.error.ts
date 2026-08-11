export class AccountInactiveError extends Error {
  constructor(message = 'Account is inactive') {
    super(message);
    this.name = 'AccountInactiveError';
  }
}
