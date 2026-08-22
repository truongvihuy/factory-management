import { Injectable } from '@nestjs/common';

import { AccessScope as PrismaAccessScope } from '@/infrastructure/database/prisma/generated';
import { PrismaService } from '@/infrastructure/database/prisma/prisma.service';

import {
  AuthorizationContext,
  AuthorizationRole,
} from '@/modules/authorization/application/authorization/authorization.type';
import { AccessScope } from '@/modules/authorization/domain/value-objects';
import { AuthorizationContextPort } from '@/modules/authorization/ports/outbound';

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
