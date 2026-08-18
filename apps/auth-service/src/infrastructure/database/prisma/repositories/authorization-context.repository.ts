import { Injectable } from '@nestjs/common';

import type { AuthorizationContextPort } from '@/modules/authorization/application/ports/authorization-context.port';
import type {
  AuthorizationContext,
  AuthorizationRole,
} from '@/modules/authorization/domain/models/authorization-context';
import { AccessScope } from '@/modules/authorization/domain/value-objects/access-scope.vo';

import { AccessScope as PrismaAccessScope } from '../generated';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AuthorizationContextRepository implements AuthorizationContextPort {
  constructor(private readonly prisma: PrismaService) {}

  async getByUserId(userId: string): Promise<AuthorizationContext> {
    const userRoles = await this.prisma.userRole.findMany({
      where: {
        userId,
        revokedAt: null,
      },
      include: {
        role: {
          include: {
            rolePermissions: {
              include: {
                permission: true,
              },
            },
          },
        },
      },
    });

    const roles: AuthorizationRole[] = userRoles.map((userRole) => ({
      code: userRole.role.code,
      permissions: userRole.role.rolePermissions.map((rolePermission) => rolePermission.permission.code),
      scope: this.mapScope(userRole.scope),
      factoryId: userRole.factoryId,
      revokedAt: userRole.revokedAt,
    }));

    return {
      userId,
      roles,
    };
  }

  private mapScope(scope: PrismaAccessScope): AccessScope {
    switch (scope) {
      case PrismaAccessScope.GLOBAL:
        return AccessScope.GLOBAL;

      case PrismaAccessScope.FACTORY:
        return AccessScope.FACTORY;

      default:
        throw new Error(`Unsupported access scope: ${scope}`);
    }
  }
}
