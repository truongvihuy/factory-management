import { JwtService } from '@nestjs/jwt';
import { Test, type TestingModule } from '@nestjs/testing';

import { UserStatus } from '../../src/infrastructure/database/prisma/generated';
import { PrismaService } from '../../src/infrastructure/database/prisma/prisma.service';
import { PrismaUserRepository } from '../../src/infrastructure/database/prisma/repositories/user.repository';
import { Argon2PasswordHasherService } from '../../src/infrastructure/security/password/argon2-password-hasher.service';
import { JwtAccessTokenIssuerService } from '../../src/infrastructure/security/token/jwt-access-token-issuer.service';

import { AccountInactiveError } from '../../src/modules/authentication/exceptions/account-inactive.error';
import { AccountLockedError } from '../../src/modules/authentication/exceptions/account-locked.error';
import { InvalidCredentialsError } from '../../src/modules/authentication/exceptions/invalid-credentials.error';
import { LoginUseCase } from '../../src/modules/authentication/services/login.use-case';

describe('Authentication Integration', () => {
  let module: TestingModule;

  let prisma: PrismaService;
  let loginUseCase: LoginUseCase;
  let passwordHasher: Argon2PasswordHasherService;

  const testPassword = 'password123';
  const wrongPassword = 'wrong-password';

  const MAX_FAILED_LOGIN_ATTEMPTS = 5;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      providers: [
        PrismaService,

        Argon2PasswordHasherService,

        JwtService,

        JwtAccessTokenIssuerService,

        PrismaUserRepository,

        LoginUseCase,
      ],
    }).compile();

    prisma = module.get<PrismaService>(PrismaService);

    passwordHasher = module.get<Argon2PasswordHasherService>(Argon2PasswordHasherService);

    loginUseCase = module.get<LoginUseCase>(LoginUseCase);

    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await module.close();
  });

  beforeEach(async () => {
    await prisma.user.deleteMany({
      where: {
        username: {
          startsWith: 'integration-',
        },
      },
    });
  });

  afterEach(async () => {
    await prisma.user.deleteMany({
      where: {
        username: {
          startsWith: 'integration-',
        },
      },
    });
  });

  async function createUser(
    overrides: {
      username?: string;
      email?: string;
      status?: UserStatus;
      password?: string;
      failedLoginAttempts?: number;
      lockedUntil?: Date | null;
      lastLoginAt?: Date | null;
    } = {},
  ) {
    const password = overrides.password ?? testPassword;

    const passwordHash = await passwordHasher.hash(password);

    return prisma.user.create({
      data: {
        username: overrides.username ?? 'integration-user',
        email: overrides.email ?? `${overrides.username ?? 'integration-user'}@example.com`,
        displayName: 'Integration User',
        passwordHash,
        status: overrides.status ?? UserStatus.ACTIVE,
        failedLoginAttempts: overrides.failedLoginAttempts ?? 0,
        lockedUntil: overrides.lockedUntil ?? null,
        lastLoginAt: overrides.lastLoginAt ?? null,
      },
    });
  }

  async function findUser(userId: string) {
    return prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
  }

  describe('valid credentials', () => {
    it('should login successfully with valid credentials', async () => {
      const user = await createUser();

      const result = await loginUseCase.execute(user.username, testPassword);

      expect(result).toBeDefined();
      expect(result.accessToken).toBeDefined();
      expect(typeof result.accessToken).toBe('string');

      expect(result.user.id).toBe(user.id);
      expect(result.user.username).toBe(user.username);
      expect(result.user.email).toBe(user.email);
      expect(result.user.displayName).toBe(user.displayName);
    });
  });

  describe('invalid password', () => {
    it('should reject login with invalid password', async () => {
      const user = await createUser();

      await expect(loginUseCase.execute(user.username, wrongPassword)).rejects.toBeInstanceOf(InvalidCredentialsError);
    });
  });

  describe('unknown user', () => {
    it('should reject login when user does not exist', async () => {
      await expect(loginUseCase.execute('integration-user-not-found', testPassword)).rejects.toBeInstanceOf(
        InvalidCredentialsError,
      );
    });
  });

  describe('inactive user', () => {
    it('should reject login for inactive user', async () => {
      const user = await createUser({
        username: 'integration-inactive',
        status: UserStatus.INACTIVE,
      });

      await expect(loginUseCase.execute(user.username, testPassword)).rejects.toBeInstanceOf(AccountInactiveError);
    });
  });

  describe('locked user', () => {
    it('should reject login for locked user', async () => {
      const user = await createUser({
        username: 'integration-locked',
        status: UserStatus.LOCKED,
        failedLoginAttempts: MAX_FAILED_LOGIN_ATTEMPTS,
      });

      await expect(loginUseCase.execute(user.username, testPassword)).rejects.toBeInstanceOf(AccountLockedError);
    });
  });

  describe('failed login attempts', () => {
    it('should increment failed login attempts', async () => {
      const user = await createUser({
        username: 'integration-failed-attempt',
      });

      await expect(loginUseCase.execute(user.username, wrongPassword)).rejects.toBeInstanceOf(InvalidCredentialsError);

      const updatedUser = await findUser(user.id);

      expect(updatedUser?.failedLoginAttempts).toBe(1);
    });
  });

  describe('account lock threshold', () => {
    it('should lock the account after reaching the threshold', async () => {
      const user = await createUser({
        username: 'integration-lock-threshold',
        failedLoginAttempts: MAX_FAILED_LOGIN_ATTEMPTS - 1,
      });

      await expect(loginUseCase.execute(user.username, wrongPassword)).rejects.toBeInstanceOf(InvalidCredentialsError);

      const updatedUser = await findUser(user.id);

      expect(updatedUser?.failedLoginAttempts).toBe(MAX_FAILED_LOGIN_ATTEMPTS);

      expect(updatedUser?.status).toBe(UserStatus.LOCKED);
    });
  });

  describe('successful login security state', () => {
    it('should reset failed login attempts after successful login', async () => {
      const user = await createUser({
        username: 'integration-reset-failures',
        failedLoginAttempts: 3,
      });

      await loginUseCase.execute(user.username, testPassword);

      const updatedUser = await findUser(user.id);

      expect(updatedUser?.failedLoginAttempts).toBe(0);
    });

    it('should update lastLoginAt after successful login', async () => {
      const user = await createUser({
        username: 'integration-last-login',
        lastLoginAt: null,
      });

      expect(user.lastLoginAt).toBeNull();

      await loginUseCase.execute(user.username, testPassword);

      const updatedUser = await findUser(user.id);

      expect(updatedUser?.lastLoginAt).toBeInstanceOf(Date);
    });
  });

  describe('access token', () => {
    it('should issue an access token after successful login', async () => {
      const user = await createUser({
        username: 'integration-token',
      });

      const result = await loginUseCase.execute(user.username, testPassword);

      expect(result.accessToken).toBeDefined();
      expect(typeof result.accessToken).toBe('string');
      expect(result.accessToken.length).toBeGreaterThan(0);

      expect(result.expiresIn).toBeDefined();
      expect(result.expiresIn).toBeGreaterThan(0);
    });
  });
});
