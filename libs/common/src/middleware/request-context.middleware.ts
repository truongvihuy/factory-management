import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { randomUUID } from 'node:crypto';
import { REQUEST_ID, USER_ID } from '../constants/header.constant';

@Injectable()
export class RequestContextGateWayMiddleware implements NestMiddleware {
  use(req: any, res: Response, next: NextFunction) {
    const requestId = randomUUID();
    req.requestId = requestId;

    res.setHeader(REQUEST_ID, requestId);

    next();
  }
}

@Injectable()
export class RequestContextServiceMiddleware implements NestMiddleware {
  use(req: any, res: Response, next: NextFunction) {
    req['requestId'] = req.headers[REQUEST_ID];
    req['userId'] = req.headers[USER_ID];

    next();
  }
}
