import { RpcException } from '@nestjs/microservices';

export class BusinessException extends RpcException {
  constructor(code: string, message: string, details?: any) {
    super({
      code,
      message,
      details,
    });
  }
}
