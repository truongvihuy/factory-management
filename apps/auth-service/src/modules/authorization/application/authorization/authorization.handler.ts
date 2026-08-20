import { ICommandHandler } from '@nestjs/cqrs';

import { AuthorizationDeniedError } from '../../domain/errors';
import { AccessScope } from '../../domain/value-objects';
import { AuthorizationHandlerPort } from '../../ports/inbound';
import { AuthorizationContextPort } from '../../ports/outbound';
import { AuthorizationCommand } from './authorization.command';
import { AuthorizationContext, AuthorizationRequest, AuthorizationRole } from './authorization.type';

export class AuthorizationHandler implements ICommandHandler<AuthorizationCommand>, AuthorizationHandlerPort {
  constructor(private readonly authorizationContext: AuthorizationContextPort) {}

  async execute(command: AuthorizationCommand): Promise<boolean> {
    const context = await this.authorizationContext.getByUserId(command.userId);

    AuthorizationHandler.ensureCanAccess(context, {
      permission: command.permission,
      factoryId: command.factoryId,
    });

    return true;
  }

  private static ensureCanAccess(context: AuthorizationContext, request: AuthorizationRequest): void {
    const authorized = context.roles.some((role) => AuthorizationHandler.roleCanAccess(role, request));

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
