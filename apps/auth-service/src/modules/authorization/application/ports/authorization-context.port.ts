import { AuthorizationContext } from '../../domain/models/authorization-context';

export interface AuthorizationContextPort {
  getByUserId(userId: string): Promise<AuthorizationContext>;
}
