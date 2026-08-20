import { ICommandHandler } from '@nestjs/cqrs';
import { AuthorizationCommand } from '../../application/authorization/authorization.command';

export interface AuthorizationHandlerPort extends ICommandHandler<AuthorizationCommand> {
  execute(command: AuthorizationCommand): Promise<any>;
}
