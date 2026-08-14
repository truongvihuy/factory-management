export class InvalidCredentialsDomainError extends Error {
  constructor(message = 'Invalid username or password') {
    super(message);
    this.name = InvalidCredentialsDomainError.name;
  }
}
