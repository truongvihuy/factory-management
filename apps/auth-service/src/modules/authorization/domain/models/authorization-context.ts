import { AccessScope } from '../value-objects/access-scope.vo';

export interface AuthorizationRole {
  code: string;
  permissions: string[];
  scope: AccessScope;
  factoryId: string | null;
  revokedAt: Date | null;
}

export interface AuthorizationContext {
  userId: string;
  roles: AuthorizationRole[];
}
