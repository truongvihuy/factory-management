import { AuthorizationDeniedError } from '../errors/authorization-denied.error';
import { AuthorizationContext, AuthorizationRole } from '../models/authorization-context';
import { AuthorizationRequest } from '../models/authorization-request';
import { AccessScope } from '../value-objects/access-scope.vo';

export class AuthorizationRule {
  static ensureCanAccess(context: AuthorizationContext, request: AuthorizationRequest): void {
    const authorized = context.roles.some((role) => this.roleCanAccess(role, request));

    if (!authorized) {
      throw new AuthorizationDeniedError();
    }
  }

  private static roleCanAccess(role: AuthorizationRole, request: AuthorizationRequest): boolean {
    if (role.revokedAt !== null) {
      return false;
    }

    if (!role.permissions.includes(request.permission)) {
      return false;
    }

    if (role.scope === AccessScope.GLOBAL) {
      return true;
    }

    if (role.scope === AccessScope.FACTORY) {
      return request.factoryId !== null && role.factoryId === request.factoryId;
    }

    return false;
  }
}
