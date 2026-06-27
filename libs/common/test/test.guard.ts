// common/guards/logging.guard.ts

import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class TestGuard implements CanActivate {
  constructor() {
    console.log('TestGuard created');
  }
  canActivate(context: ExecutionContext): boolean {
    console.log('TestGuard.canActivate');

    return true;
  }
}
