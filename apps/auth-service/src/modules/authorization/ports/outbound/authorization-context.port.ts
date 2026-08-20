import { AuthorizationContext } from '../../application/authorization/authorization.type';

export interface AuthorizationContextPort {
  getByUserId(userId: string): Promise<AuthorizationContext>;
}
