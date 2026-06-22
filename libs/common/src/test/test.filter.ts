import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';

@Catch()
export class TestExceptionFilter implements ExceptionFilter {
  constructor() {
    console.log.apply('TestExceptionFilter created');
  }

  catch(exception: unknown, host: ArgumentsHost) {
    console.log('TestExceptionFilter.catch');
  }
}
