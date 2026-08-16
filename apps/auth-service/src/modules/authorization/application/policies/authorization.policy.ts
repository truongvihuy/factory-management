import { AuthorizationRule } from '../../domain/rules/authorization.rule';
import { AuthorizationContextPort } from '../ports/authorization-context.port';

export class AuthorizationPolicy {
  constructor(private readonly authorizationPort: AuthorizationContextPort) {}

  async authorize(userId: string, permission: string, factoryId?: string) {
    const context = await this.authorizationPort.getByUserId(userId);

    return AuthorizationRule.ensureCanAccess(context, {
      permission,
      factoryId: factoryId ?? null,
    });
  }
}
