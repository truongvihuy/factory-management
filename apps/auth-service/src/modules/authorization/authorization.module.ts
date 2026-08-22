import { Module } from '@nestjs/common';

import { AuthorizationContextRepository } from '@/modules/authorization/infrastructure/repositories/authorization-context.repository';

import { AUTHORIZATION_CONTEXT_PORT } from './ports/token';
import { AuthorizationGuard } from './presentation/guards/authorization.guard';

@Module({
  imports: [],
  controllers: [],
  providers: [
    {
      provide: AUTHORIZATION_CONTEXT_PORT,
      useClass: AuthorizationContextRepository,
    },
    AuthorizationGuard,
  ],
  exports: [AuthorizationGuard],
})
export class AuthorizationModule {}
