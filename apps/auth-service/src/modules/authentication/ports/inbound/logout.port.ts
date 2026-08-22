import { ICommandHandler } from '@nestjs/cqrs';

import { LogoutCommand } from '../../application/commands/logout/logout.command';

export interface LogoutHandlerPort extends ICommandHandler<LogoutCommand> {
  execute(command: LogoutCommand): Promise<void>;
}
