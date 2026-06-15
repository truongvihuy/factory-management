import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { REQUEST_ID } from '../constants/header.constant';

@Injectable()
export class RequestIdServiceMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    (req as any)['requestId'] = req.headers[REQUEST_ID];

    next();
  }
}
