import { authRedisKeys } from './auth-redis.keys';

describe('authRedisKeys', () => {
  it('should generate session key', () => {
    expect(authRedisKeys.session('user-123')).toBe('fms:auth:session:user:user-123');
  });

  it('should generate login attempt key', () => {
    expect(authRedisKeys.loginAttempt('user-123')).toBe('fms:auth:login-attempt:user:user-123');
  });

  it('should generate refresh token key', () => {
    expect(authRedisKeys.refreshToken('token-123')).toBe('fms:auth:refresh-token:token-123');
  });

  it('should generate login rate-limit key', () => {
    expect(authRedisKeys.loginRateLimit('huy')).toBe('fms:auth:rate-limit:login:huy');
  });
});
