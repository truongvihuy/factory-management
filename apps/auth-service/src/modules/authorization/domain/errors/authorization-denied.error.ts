export class AuthorizationDeniedError extends Error {
  constructor(message = 'Authorization denied') {
    super(message);
    this.name = AuthorizationDeniedError.name;
  }
}
