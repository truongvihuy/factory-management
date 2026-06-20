import { Injectable, NestMiddleware } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { NextFunction, Request, Response } from 'express';
import { REQUEST_ID } from '../constants/header.constant';

@Injectable()
export class RequestIdGatewayMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const requestId = randomUUID();

    (req as any)['requestId'] = requestId;
    res.setHeader(REQUEST_ID, requestId);

    next();
  }
}
