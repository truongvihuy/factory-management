import { ICommandHandler } from '@nestjs/cqrs';

import { RevorkedCommand } from '../../application/commands/revorked/revorked.command';

export interface RevorkedHandlerPort extends ICommandHandler<RevorkedCommand> {
  execute(command: RevorkedCommand): Promise<void>;
}
