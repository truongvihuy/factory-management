import { AppException } from './app.exception';

export function throwException(status: number, code: string, message: string, details?: unknown): never {
  throw new AppException(status, {
    code,
    message,
    details,
  });
}
