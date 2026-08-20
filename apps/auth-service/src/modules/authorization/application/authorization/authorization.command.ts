export class AuthorizationCommand {
  constructor(
    public readonly userId: string,
    public readonly permission: string,
    public readonly factoryId: string | null = null,
  ) {}
}
