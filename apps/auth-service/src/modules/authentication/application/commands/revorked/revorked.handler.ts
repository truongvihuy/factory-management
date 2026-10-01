import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { RevorkedHandlerPort } from '@/modules/authentication/ports/inbound';
import { SessionStorePort } from '@/modules/authentication/ports/outbound';
import { SESSION_STORE_PORT } from '@/modules/authentication/ports/token';

import { RevorkedCommand } from './revorked.command';

@CommandHandler(RevorkedCommand)
export class RefeshTokenHandler implements ICommandHandler<RevorkedCommand>, RevorkedHandlerPort {
  constructor(
    @Inject(SESSION_STORE_PORT)
    private readonly sessionStore: SessionStorePort,
  ) {}

  async execute(command: RevorkedCommand): Promise<void> {
    await this.sessionStore.revorked('');
  }
}
