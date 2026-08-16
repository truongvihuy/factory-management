import { AuthorizationContextRepository } from '@/infrastructure/database/prisma/repositories/authorization-context.repository';
import { Module } from '@nestjs/common';
import { AUTHORIZATION_CONTEXT_PORT } from './application/ports/application.token';
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
