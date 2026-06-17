import { SetMetadata } from '@nestjs/common';
import { IS_ADMIN_KEY } from '../constants/key-metadata.constant';

export const Admin = (admin: boolean = true) => SetMetadata(IS_ADMIN_KEY, admin);
