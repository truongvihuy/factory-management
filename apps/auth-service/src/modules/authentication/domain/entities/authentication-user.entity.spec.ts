import {
  AuthenticationUser,
  AuthenticationUserStatus,
  type AuthenticationUserProps,
} from './authentication-user.entity';

describe('AuthenticationUser', () => {
  const props: AuthenticationUserProps = {
    id: 'user-1',
    username: 'huy',
    email: 'huy@example.com',
    displayName: 'Huy',
    passwordHash: 'hashed-password',
    status: AuthenticationUserStatus.ACTIVE,
    lockedUntil: null,
    lastLoginAt: null,
  };

  it('should create an authentication user', () => {
    const user = AuthenticationUser.create(props);

    expect(user).toBeInstanceOf(AuthenticationUser);
  });

  it('should expose user identity', () => {
    const user = AuthenticationUser.create(props);

    expect(user.id).toBe('user-1');
    expect(user.username).toBe('huy');
    expect(user.email).toBe('huy@example.com');
    expect(user.displayName).toBe('Huy');
  });

  it('should expose authentication state', () => {
    const user = AuthenticationUser.create(props);

    expect(user.status).toBe(AuthenticationUserStatus.ACTIVE);
    expect(user.lockedUntil).toBeNull();
    expect(user.lastLoginAt).toBeNull();
  });

  it('should expose password hash', () => {
    const user = AuthenticationUser.create(props);

    expect(user.passwordHash).toBe('hashed-password');
  });

  it('should support locked user state', () => {
    const lockedUntil = new Date('2026-08-14T12:00:00.000Z');

    const user = AuthenticationUser.create({
      ...props,
      status: AuthenticationUserStatus.LOCKED,
      lockedUntil,
    });

    expect(user.status).toBe(AuthenticationUserStatus.LOCKED);
    expect(user.lockedUntil).toEqual(lockedUntil);
  });
});
