import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { LogoutHandlerPort } from '@/modules/authentication/ports/inbound';
import { SessionStorePort } from '@/modules/authentication/ports/outbound';
import { SESSION_STORE_PORT } from '@/modules/authentication/ports/token';

import { LogoutCommand } from './logout.command';

@CommandHandler(LogoutCommand)
export class LogoutHandler implements ICommandHandler<LogoutCommand>, LogoutHandlerPort {
  constructor(
    @Inject(SESSION_STORE_PORT)
    private readonly sessionStore: SessionStorePort,
  ) {}

  async execute(command: LogoutCommand): Promise<void> {
    await this.sessionStore.revorked(command.sessionId);
  }
}
