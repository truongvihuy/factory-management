import { SetMetadata } from '@nestjs/common';
import { Role } from 'generated/prisma';
import { ROLES_KEY } from '../constants/key-metadata.constant';

export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
