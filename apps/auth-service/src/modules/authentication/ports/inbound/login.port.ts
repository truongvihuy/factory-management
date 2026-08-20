import { ICommandHandler } from '@nestjs/cqrs';

import { LoginCommand } from '../../application/commands/login/login.command';
import { AuthenticationResult } from '../../application/commands/login/login.type';

export interface LoginHandlerPort extends ICommandHandler<LoginCommand> {
  execute(command: LoginCommand): Promise<AuthenticationResult>;
}
