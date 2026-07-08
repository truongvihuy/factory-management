import { SetMetadata } from '@nestjs/common';
import { PERMISSION_KEY } from '../constants/key-metadata.constant';
import { PermissionCode } from '../constants/permission.constant';

export const Permission = (permission: PermissionCode) => SetMetadata(PERMISSION_KEY, permission);
