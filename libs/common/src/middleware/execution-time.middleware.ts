import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class ExecutionTimeMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    (req as any).startTime = new Date();

    next();
  }
}
