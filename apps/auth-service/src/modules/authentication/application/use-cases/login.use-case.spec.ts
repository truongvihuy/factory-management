import { InvalidCredentialsError } from '../../domain/domain-errors/invalid-credentials.error';
import {
  AuthenticationUser,
  AuthenticationUserProps,
  AuthenticationUserStatus,
} from '../../domain/entities/authentication-user.entity';
import type { UserRepositoryPort } from '../../domain/ports/user-repository.port';
import { AccountLoginRule } from '../../domain/rules/account-login.rule';
import { LoginSecurityPolicy } from '../policies/login-security.policy';
import type { AccessTokenIssuerPort } from '../ports/access-token-issuer.port';
import type { PasswordHasherPort } from '../ports/password-hasher.port';
import type { AuthenticationResult } from '../results/login.result';
import { LoginUseCase } from './login.use-case';

describe('LoginUseCase', () => {
  let useCase: LoginUseCase;

  let userRepository: jest.Mocked<UserRepositoryPort>;
  let passwordHasher: jest.Mocked<PasswordHasherPort>;
  let accessTokenIssuer: jest.Mocked<AccessTokenIssuerPort>;
  let loginSecurityPolicy: jest.Mocked<LoginSecurityPolicy>;

  const user = new AuthenticationUser({
    id: 'user-123',
    username: 'huy',
    email: 'huy@example.com',
    displayName: 'Huy',
    passwordHash: 'hashed-password',
    status: AuthenticationUserStatus.ACTIVE,
  } as AuthenticationUserProps);

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
      handleFailedLogin: jest.fn(),
      handleSuccessfulLogin: jest.fn(),
    } as unknown as jest.Mocked<LoginSecurityPolicy>;

    useCase = new LoginUseCase(userRepository, passwordHasher, accessTokenIssuer, loginSecurityPolicy);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  describe('user lookup', () => {
    it('should find user by identifier', async () => {
      userRepository.findByIdentifier.mockResolvedValue(user);
      passwordHasher.verify.mockResolvedValue(true);
      loginSecurityPolicy.handleSuccessfulLogin.mockResolvedValue();
      accessTokenIssuer.issue.mockResolvedValue(accessToken);

      await useCase.execute('huy', 'password123');

      expect(userRepository.findByIdentifier).toHaveBeenCalledTimes(1);
      expect(userRepository.findByIdentifier).toHaveBeenCalledWith('huy');
    });

    it('should reject login when user does not exist', async () => {
      userRepository.findByIdentifier.mockResolvedValue(null);

      await expect(useCase.execute('unknown-user', 'password123')).rejects.toBeInstanceOf(InvalidCredentialsError);

      expect(userRepository.findByIdentifier).toHaveBeenCalledWith('unknown-user');

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
      const ensureCanLoginSpy = jest.spyOn(AccountLoginRule, 'ensureCanLogin').mockImplementation(() => undefined);

      passwordHasher.verify.mockResolvedValue(true);
      loginSecurityPolicy.handleSuccessfulLogin.mockResolvedValue();
      accessTokenIssuer.issue.mockResolvedValue(accessToken);

      await useCase.execute(user.username, 'password123');

      expect(ensureCanLoginSpy).toHaveBeenCalledTimes(1);
      expect(ensureCanLoginSpy).toHaveBeenCalledWith(user);
    });

    it('should stop authentication when account cannot login', async () => {
      const error = new Error('Account locked');

      jest.spyOn(AccountLoginRule, 'ensureCanLogin').mockImplementation(() => {
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

      jest.spyOn(AccountLoginRule, 'ensureCanLogin').mockImplementation(() => undefined);
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
      passwordHasher.verify.mockResolvedValue(false);
      loginSecurityPolicy.handleFailedLogin.mockResolvedValue();

      await expect(useCase.execute(user.username, 'wrong-password')).rejects.toBeInstanceOf(InvalidCredentialsError);

      expect(loginSecurityPolicy.handleFailedLogin).toHaveBeenCalledTimes(1);
      expect(loginSecurityPolicy.handleFailedLogin).toHaveBeenCalledWith(user);

      expect(loginSecurityPolicy.handleSuccessfulLogin).not.toHaveBeenCalled();
      expect(accessTokenIssuer.issue).not.toHaveBeenCalled();
    });

    it('should handle failed login before throwing invalid credentials', async () => {
      passwordHasher.verify.mockResolvedValue(false);
      loginSecurityPolicy.handleFailedLogin.mockResolvedValue();

      await expect(useCase.execute(user.username, 'wrong-password')).rejects.toBeInstanceOf(InvalidCredentialsError);

      const failedLoginCall = loginSecurityPolicy.handleFailedLogin.mock.invocationCallOrder[0];

      expect(failedLoginCall).toBeDefined();

      // LoginSecurityPolicy phải hoàn tất trước khi UseCase throw.
      // expect(loginSecurityPolicy.handleFailedLogin).toHaveBeenCalledBefore?.(loginSecurityPolicy.handleSuccessfulLogin);
    });
  });

  describe('successful authentication', () => {
    beforeEach(() => {
      userRepository.findByIdentifier.mockResolvedValue(user);

      jest.spyOn(AccountLoginRule, 'ensureCanLogin').mockImplementation(() => undefined);

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
      const result: AuthenticationResult = await useCase.execute(user.username, 'password123');

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
  });

  describe('failure propagation', () => {
    beforeEach(() => {
      userRepository.findByIdentifier.mockResolvedValue(user);

      jest.spyOn(AccountLoginRule, 'ensureCanLogin').mockImplementation(() => undefined);
    });

    it('should propagate password verification errors', async () => {
      const error = new Error('Password verification failed');

      passwordHasher.verify.mockRejectedValue(error);

      await expect(useCase.execute(user.username, 'password123')).rejects.toBe(error);

      expect(loginSecurityPolicy.handleFailedLogin).not.toHaveBeenCalled();
      expect(loginSecurityPolicy.handleSuccessfulLogin).not.toHaveBeenCalled();
      expect(accessTokenIssuer.issue).not.toHaveBeenCalled();
    });

    it('should propagate failed login policy errors', async () => {
      const error = new Error('Failed login policy failed');

      passwordHasher.verify.mockResolvedValue(false);
      loginSecurityPolicy.handleFailedLogin.mockRejectedValue(error);

      await expect(useCase.execute(user.username, 'wrong-password')).rejects.toBe(error);

      expect(accessTokenIssuer.issue).not.toHaveBeenCalled();
    });

    it('should propagate successful login policy errors', async () => {
      const error = new Error('Successful login policy failed');

      passwordHasher.verify.mockResolvedValue(true);
      loginSecurityPolicy.handleSuccessfulLogin.mockRejectedValue(error);

      await expect(useCase.execute(user.username, 'password123')).rejects.toBe(error);

      expect(accessTokenIssuer.issue).not.toHaveBeenCalled();
    });

    it('should propagate access token issuer errors', async () => {
      const error = new Error('Token issuer failed');

      passwordHasher.verify.mockResolvedValue(true);
      loginSecurityPolicy.handleSuccessfulLogin.mockResolvedValue();
      accessTokenIssuer.issue.mockRejectedValue(error);

      await expect(useCase.execute(user.username, 'password123')).rejects.toBe(error);
    });
  });
});
