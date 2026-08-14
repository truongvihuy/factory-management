import { LoginSecurityPolicy } from './login-security.policy';
import { LoginUseCase } from './login.use-case';

import type { AccessTokenIssuer } from '../interfaces/access-token-issuer.interface';
import type { AuthenticationUser } from '../interfaces/authentication.types';
import type { PasswordHasher } from '../interfaces/password-hasher.interface';
import type { UserRepository } from '../interfaces/user-repository.interface';

describe('LoginUseCase', () => {
  let useCase: LoginUseCase;

  let userRepository: jest.Mocked<UserRepository>;
  let passwordHasher: jest.Mocked<PasswordHasher>;
  let accessTokenIssuer: jest.Mocked<AccessTokenIssuer>;
  let loginSecurityPolicy: jest.Mocked<LoginSecurityPolicy>;

  const user: AuthenticationUser = {
    id: 'user-123',
    username: 'huy',
    email: 'huy@example.com',
    displayName: 'Huy',
    passwordHash: 'hashed-password',
    status: 'ACTIVE' as AuthenticationUser['status'],
    lockedUntil: null,
    lastLoginAt: null,
  };

  const accessToken = {
    accessToken: 'access-token-123',
    expiresIn: 900,
  };

  beforeEach(() => {
    userRepository = {
      findByIdentifier: jest.fn(),
      lockUser: jest.fn(),
      unlockUser: jest.fn(),
      resetLoginSecurityState: jest.fn(),
      updateLastLoginAt: jest.fn(),
    };

    passwordHasher = {
      hash: jest.fn(),
      verify: jest.fn(),
    };

    accessTokenIssuer = {
      issue: jest.fn(),
    };

    loginSecurityPolicy = {
      ensureAccountCanLogin: jest.fn(),
      handleFailedLogin: jest.fn(),
      handleSuccessfulLogin: jest.fn(),
      invalidCredentials: jest.fn(),
    } as unknown as jest.Mocked<LoginSecurityPolicy>;

    useCase = new LoginUseCase(userRepository, passwordHasher, accessTokenIssuer, loginSecurityPolicy);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('user lookup', () => {
    it('should find user by identifier', async () => {
      userRepository.findByIdentifier.mockResolvedValue(user);
      loginSecurityPolicy.ensureAccountCanLogin.mockImplementation();
      passwordHasher.verify.mockResolvedValue(true);
      loginSecurityPolicy.handleSuccessfulLogin.mockResolvedValue();
      accessTokenIssuer.issue.mockResolvedValue(accessToken);

      await useCase.execute('huy', 'password123');

      expect(userRepository.findByIdentifier).toHaveBeenCalledTimes(1);
      expect(userRepository.findByIdentifier).toHaveBeenCalledWith('huy');
    });

    it('should reject login when user does not exist', async () => {
      const error = new Error('Invalid credentials');

      userRepository.findByIdentifier.mockResolvedValue(null);
      loginSecurityPolicy.invalidCredentials.mockReturnValue(error);

      await expect(useCase.execute('unknown-user', 'password123')).rejects.toBe(error);

      expect(loginSecurityPolicy.invalidCredentials).toHaveBeenCalledTimes(1);

      expect(loginSecurityPolicy.ensureAccountCanLogin).not.toHaveBeenCalled();
      expect(passwordHasher.verify).not.toHaveBeenCalled();
      expect(loginSecurityPolicy.handleFailedLogin).not.toHaveBeenCalled();
      expect(loginSecurityPolicy.handleSuccessfulLogin).not.toHaveBeenCalled();
      expect(accessTokenIssuer.issue).not.toHaveBeenCalled();
    });
  });

  describe('account security', () => {
    beforeEach(() => {
      userRepository.findByIdentifier.mockResolvedValue(user);
    });

    it('should check whether account can login', async () => {
      loginSecurityPolicy.ensureAccountCanLogin.mockImplementation();
      passwordHasher.verify.mockResolvedValue(true);
      loginSecurityPolicy.handleSuccessfulLogin.mockResolvedValue();
      accessTokenIssuer.issue.mockResolvedValue(accessToken);

      await useCase.execute(user.username, 'password123');

      expect(loginSecurityPolicy.ensureAccountCanLogin).toHaveBeenCalledTimes(1);

      expect(loginSecurityPolicy.ensureAccountCanLogin).toHaveBeenCalledWith(user);
    });

    it('should stop authentication when account cannot login', async () => {
      const error = new Error('Account locked');

      loginSecurityPolicy.ensureAccountCanLogin.mockImplementation(() => {
        throw error;
      });

      await expect(useCase.execute(user.username, 'password123')).rejects.toBe(error);

      expect(passwordHasher.verify).not.toHaveBeenCalled();
      expect(loginSecurityPolicy.handleFailedLogin).not.toHaveBeenCalled();
      expect(loginSecurityPolicy.handleSuccessfulLogin).not.toHaveBeenCalled();
      expect(accessTokenIssuer.issue).not.toHaveBeenCalled();
    });
  });

  describe('password verification', () => {
    beforeEach(() => {
      userRepository.findByIdentifier.mockResolvedValue(user);
      loginSecurityPolicy.ensureAccountCanLogin.mockImplementation();
    });

    it('should verify password using stored password hash', async () => {
      passwordHasher.verify.mockResolvedValue(true);
      loginSecurityPolicy.handleSuccessfulLogin.mockResolvedValue();
      accessTokenIssuer.issue.mockResolvedValue(accessToken);

      await useCase.execute(user.username, 'password123');

      expect(passwordHasher.verify).toHaveBeenCalledTimes(1);

      expect(passwordHasher.verify).toHaveBeenCalledWith('password123', user.passwordHash);
    });

    it('should reject invalid password', async () => {
      const error = new Error('Invalid credentials');

      passwordHasher.verify.mockResolvedValue(false);
      loginSecurityPolicy.handleFailedLogin.mockResolvedValue();
      loginSecurityPolicy.invalidCredentials.mockReturnValue(error);

      await expect(useCase.execute(user.username, 'wrong-password')).rejects.toBe(error);

      expect(loginSecurityPolicy.handleFailedLogin).toHaveBeenCalledTimes(1);

      expect(loginSecurityPolicy.handleFailedLogin).toHaveBeenCalledWith(user);

      expect(loginSecurityPolicy.handleSuccessfulLogin).not.toHaveBeenCalled();

      expect(accessTokenIssuer.issue).not.toHaveBeenCalled();
    });

    it('should handle failed login before returning invalid credentials', async () => {
      const error = new Error('Invalid credentials');

      passwordHasher.verify.mockResolvedValue(false);
      loginSecurityPolicy.handleFailedLogin.mockResolvedValue();
      loginSecurityPolicy.invalidCredentials.mockReturnValue(error);

      await expect(useCase.execute(user.username, 'wrong-password')).rejects.toBe(error);

      const failedLoginCall = loginSecurityPolicy.handleFailedLogin.mock.invocationCallOrder[0];

      const invalidCredentialsCall = loginSecurityPolicy.invalidCredentials.mock.invocationCallOrder[0];

      expect(failedLoginCall).toBeLessThan(invalidCredentialsCall!);
    });
  });

  describe('successful authentication', () => {
    beforeEach(() => {
      userRepository.findByIdentifier.mockResolvedValue(user);

      loginSecurityPolicy.ensureAccountCanLogin.mockImplementation();

      passwordHasher.verify.mockResolvedValue(true);

      loginSecurityPolicy.handleSuccessfulLogin.mockResolvedValue();

      accessTokenIssuer.issue.mockResolvedValue(accessToken);
    });

    it('should handle successful login security state', async () => {
      await useCase.execute(user.username, 'password123');

      expect(loginSecurityPolicy.handleSuccessfulLogin).toHaveBeenCalledTimes(1);

      expect(loginSecurityPolicy.handleSuccessfulLogin).toHaveBeenCalledWith(user);
    });

    it('should issue access token for authenticated user', async () => {
      await useCase.execute(user.username, 'password123');

      expect(accessTokenIssuer.issue).toHaveBeenCalledTimes(1);

      expect(accessTokenIssuer.issue).toHaveBeenCalledWith({
        userId: user.id,
      });
    });

    it('should return authentication result', async () => {
      const result = await useCase.execute(user.username, 'password123');

      expect(result).toEqual({
        accessToken: 'access-token-123',
        tokenType: 'Bearer',
        expiresIn: 900,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          displayName: user.displayName,
        },
      });
    });

    it('should return Bearer token type', async () => {
      const result = await useCase.execute(user.username, 'password123');

      expect(result.tokenType).toBe('Bearer');
    });

    it('should return access token expiration', async () => {
      const result = await useCase.execute(user.username, 'password123');

      expect(result.expiresIn).toBe(900);
    });
  });

  describe('failure propagation', () => {
    beforeEach(() => {
      userRepository.findByIdentifier.mockResolvedValue(user);
      loginSecurityPolicy.ensureAccountCanLogin.mockImplementation();
    });

    it('should propagate password verification errors', async () => {
      const error = new Error('Password service unavailable');

      passwordHasher.verify.mockRejectedValue(error);

      await expect(useCase.execute(user.username, 'password123')).rejects.toBe(error);

      expect(loginSecurityPolicy.handleFailedLogin).not.toHaveBeenCalled();

      expect(accessTokenIssuer.issue).not.toHaveBeenCalled();
    });

    it('should propagate failed login policy errors', async () => {
      const error = new Error('Failed login policy error');

      passwordHasher.verify.mockResolvedValue(false);

      loginSecurityPolicy.handleFailedLogin.mockRejectedValue(error);

      await expect(useCase.execute(user.username, 'wrong-password')).rejects.toBe(error);

      expect(accessTokenIssuer.issue).not.toHaveBeenCalled();
    });

    it('should propagate successful login policy errors', async () => {
      const error = new Error('Security state update failed');

      passwordHasher.verify.mockResolvedValue(true);

      loginSecurityPolicy.handleSuccessfulLogin.mockRejectedValue(error);

      await expect(useCase.execute(user.username, 'password123')).rejects.toBe(error);

      expect(accessTokenIssuer.issue).not.toHaveBeenCalled();
    });

    it('should propagate token issuer errors', async () => {
      const error = new Error('Token issuer unavailable');

      passwordHasher.verify.mockResolvedValue(true);

      loginSecurityPolicy.handleSuccessfulLogin.mockResolvedValue();

      accessTokenIssuer.issue.mockRejectedValue(error);

      await expect(useCase.execute(user.username, 'password123')).rejects.toBe(error);
    });
  });

  describe('repository boundary', () => {
    it('should not manipulate login security state directly', async () => {
      userRepository.findByIdentifier.mockResolvedValue(user);
      loginSecurityPolicy.ensureAccountCanLogin.mockImplementation();

      passwordHasher.verify.mockResolvedValue(false);

      const error = new Error('Invalid credentials');

      loginSecurityPolicy.handleFailedLogin.mockResolvedValue();
      loginSecurityPolicy.invalidCredentials.mockReturnValue(error);

      await expect(useCase.execute(user.username, 'wrong-password')).rejects.toBe(error);

      expect(userRepository.lockUser).not.toHaveBeenCalled();
      expect(userRepository.unlockUser).not.toHaveBeenCalled();
      expect(userRepository.resetLoginSecurityState).not.toHaveBeenCalled();
      expect(userRepository.updateLastLoginAt).not.toHaveBeenCalled();
    });
  });
});
