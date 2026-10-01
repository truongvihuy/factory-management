import { ICommandHandler } from '@nestjs/cqrs';

import { RefeshTokenCommand } from '../../application/commands/refesh-token/refesh-token.command';

export interface RefeshTokenHandlerPort extends ICommandHandler<RefeshTokenCommand> {
  execute(command: RefeshTokenCommand): Promise<void>;
}
