import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { RefeshTokenHandlerPort } from '@/modules/authentication/ports/inbound';
import { SessionStorePort } from '@/modules/authentication/ports/outbound';
import { SESSION_STORE_PORT } from '@/modules/authentication/ports/token';

import { RefeshTokenCommand } from './refesh-token.command';

@CommandHandler(RefeshTokenCommand)
export class RefeshTokenHandler implements ICommandHandler<RefeshTokenCommand>, RefeshTokenHandlerPort {
  constructor(
    @Inject(SESSION_STORE_PORT)
    private readonly sessionStore: SessionStorePort,
  ) {}

  async execute(command: RefeshTokenCommand): Promise<void> {
    await this.sessionStore.revorked('');
  }
}
