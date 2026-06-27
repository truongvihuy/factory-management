import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class TestMiddleware implements NestMiddleware {
  constructor() {
    console.log('TestMiddleware created');
  }

  use(req: Request, res: Response, next: NextFunction) {
    console.log('TestMiddleware.use');
    next();
  }
}
