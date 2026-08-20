import { AccessScope } from '../../domain/value-objects';

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

export interface AuthorizationRequest {
  permission: string;
  factoryId: string | null;
}
