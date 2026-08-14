import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { Test, type TestingModule } from '@nestjs/testing';

import { AppConfigModule } from '../../src/common/config/config.module';
import {
  ACCESS_TOKEN_ISSUER,
  LOGIN_ATTEMPT_STORE,
  PASSWORD_HANSHER,
  USER_REPOSITORY,
} from '../../src/common/constants/authentication.constants';
import { UserStatus } from '../../src/infrastructure/database/prisma/generated';
import { PrismaModule } from '../../src/infrastructure/database/prisma/prisma.module';
import { PrismaService } from '../../src/infrastructure/database/prisma/prisma.service';
import { PrismaUserRepository } from '../../src/infrastructure/database/prisma/repositories/user.repository';
import { RedisLoginAttemptStore } from '../../src/infrastructure/redis/authentication/login-attempt.store';
import { RedisModule } from '../../src/infrastructure/redis/redis.module';
import { Argon2PasswordHasherService } from '../../src/infrastructure/security/password/argon2-password-hasher.service';
import { JwtAccessTokenIssuerService } from '../../src/infrastructure/security/token/jwt-access-token-issuer.service';
import { LoginAttemptStore } from '../../src/modules/authentication/interfaces/login-attempt-store.interface';
import { PasswordHasher } from '../../src/modules/authentication/interfaces/password-hasher.interface';
import { LoginSecurityPolicy } from '../../src/modules/authentication/services/login-security.policy';
import { LoginUseCase } from '../../src/modules/authentication/services/login.use-case';

import { AccountInactiveDomainError } from '../../src/modules/authentication/domain/exceptions/account-inactive.domain-error';
import { AccountLockedDomainError } from '../../src/modules/authentication/domain/exceptions/account-locked.domain-error';
import { InvalidCredentialsDomainError } from '../../src/modules/authentication/domain/exceptions/invalid-credentials.domain-error';
import { cleanupUser, createTestUser, findTestUser } from '../helpers/authentication-test.helper';

describe('Authentication Integration', () => {
  let module: TestingModule;

  let prisma: PrismaService;
  let loginUseCase: LoginUseCase;
  let passwordHasher: PasswordHasher;
  let loginAttemptStore: LoginAttemptStore;

  const TEST_PASSWORD = 'password123';
  const WRONG_PASSWORD = 'wrong-password';

  let MAX_FAILED_LOGIN_ATTEMPTS: number;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        AppConfigModule,
        PrismaModule,
        RedisModule,

        JwtModule.registerAsync({
          inject: [ConfigService],
          useFactory: (config: ConfigService) => ({
            secret: config.getOrThrow<string>('authentication.token.secret'),
            issuer: config.getOrThrow<string>('authentication.token.issuer'),
            audience: config.getOrThrow<string>('authentication.token.audience'),
            signOptions: {
              expiresIn: config.getOrThrow<number>('authentication.token.accessTokenTtlSeconds'),
            },
          }),
        }),
      ],

      providers: [
        {
          provide: PASSWORD_HANSHER,
          useClass: Argon2PasswordHasherService,
        },
        {
          provide: ACCESS_TOKEN_ISSUER,
          useClass: JwtAccessTokenIssuerService,
        },
        {
          provide: USER_REPOSITORY,
          useClass: PrismaUserRepository,
        },
        {
          provide: LOGIN_ATTEMPT_STORE,
          useClass: RedisLoginAttemptStore,
        },

        LoginSecurityPolicy,
        LoginUseCase,
      ],
    }).compile();

    prisma = module.get<PrismaService>(PrismaService);

    passwordHasher = module.get<PasswordHasher>(PASSWORD_HANSHER);

    loginUseCase = module.get<LoginUseCase>(LoginUseCase);

    loginAttemptStore = module.get<LoginAttemptStore>(LOGIN_ATTEMPT_STORE);

    const configService = module.get<ConfigService>(ConfigService);

    MAX_FAILED_LOGIN_ATTEMPTS = configService.getOrThrow<number>('authentication.security.maxLoginAttempts');

    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await module.close();
  });

  describe('valid credentials', () => {
    it('should login successfully with valid credentials', async () => {
      const user = await createTestUser(prisma, passwordHasher, {
        password: TEST_PASSWORD,
      });

      try {
        const result = await loginUseCase.execute(user.username, TEST_PASSWORD);

        expect(result).toMatchObject({
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            displayName: user.displayName,
          },
          tokenType: 'Bearer',
        });

        expect(result.accessToken).toEqual(expect.any(String));
        expect(result.accessToken.length).toBeGreaterThan(0);
        expect(result.expiresIn).toEqual(expect.any(Number));
        expect(result.expiresIn).toBeGreaterThan(0);
      } finally {
        await cleanupUser(loginAttemptStore, prisma, user.id);
      }
    });
  });

  describe('invalid password', () => {
    it('should reject invalid password', async () => {
      const user = await createTestUser(prisma, passwordHasher);

      try {
        await expect(loginUseCase.execute(user.username, WRONG_PASSWORD)).rejects.toBeInstanceOf(
          InvalidCredentialsDomainError,
        );
      } finally {
        await cleanupUser(loginAttemptStore, prisma, user.id);
      }
    });
  });

  describe('unknown user', () => {
    it('should reject unknown user', async () => {
      await expect(loginUseCase.execute('integration-user-not-found', TEST_PASSWORD)).rejects.toBeInstanceOf(
        InvalidCredentialsDomainError,
      );
    });
  });

  describe('inactive user', () => {
    it('should reject inactive user', async () => {
      const user = await createTestUser(prisma, passwordHasher, {
        status: UserStatus.INACTIVE,
      });

      try {
        await expect(loginUseCase.execute(user.username, TEST_PASSWORD)).rejects.toBeInstanceOf(
          AccountInactiveDomainError,
        );
      } finally {
        await cleanupUser(loginAttemptStore, prisma, user.id);
      }
    });
  });

  describe('locked user', () => {
    it('should reject locked user', async () => {
      const user = await createTestUser(prisma, passwordHasher, {
        status: UserStatus.LOCKED,
      });

      try {
        await expect(loginUseCase.execute(user.username, TEST_PASSWORD)).rejects.toBeInstanceOf(
          AccountLockedDomainError,
        );
      } finally {
        await cleanupUser(loginAttemptStore, prisma, user.id);
      }
    });
  });

  describe('failed login attempts', () => {
    it('should track failed login attempts in Redis', async () => {
      const user = await createTestUser(prisma, passwordHasher);

      try {
        await expect(loginUseCase.execute(user.username, WRONG_PASSWORD)).rejects.toBeInstanceOf(
          InvalidCredentialsDomainError,
        );

        const attempts = await loginAttemptStore.getAttempts(user.id);

        expect(attempts).toBe(1);
      } finally {
        await cleanupUser(loginAttemptStore, prisma, user.id);
      }
    });

    it('should increment failed login attempts in Redis', async () => {
      const user = await createTestUser(prisma, passwordHasher);

      try {
        await expect(loginUseCase.execute(user.username, WRONG_PASSWORD)).rejects.toBeInstanceOf(
          InvalidCredentialsDomainError,
        );

        await expect(loginUseCase.execute(user.username, WRONG_PASSWORD)).rejects.toBeInstanceOf(
          InvalidCredentialsDomainError,
        );

        const attempts = await loginAttemptStore.getAttempts(user.id);

        expect(attempts).toBe(2);
      } finally {
        await cleanupUser(loginAttemptStore, prisma, user.id);
      }
    });

    it('should assign failure window TTL after first failed login', async () => {
      const user = await createTestUser(prisma, passwordHasher);

      try {
        await expect(loginUseCase.execute(user.username, WRONG_PASSWORD)).rejects.toBeInstanceOf(
          InvalidCredentialsDomainError,
        );

        const ttl = await loginAttemptStore.getTtl(user.id);

        expect(ttl).toBeGreaterThan(0);
      } finally {
        await cleanupUser(loginAttemptStore, prisma, user.id);
      }
    });
  });

  describe('account lock threshold', () => {
    it('should lock account after reaching threshold', async () => {
      const user = await createTestUser(prisma, passwordHasher);

      try {
        for (let attempt = 0; attempt < MAX_FAILED_LOGIN_ATTEMPTS; attempt++) {
          await expect(loginUseCase.execute(user.username, WRONG_PASSWORD)).rejects.toBeInstanceOf(
            InvalidCredentialsDomainError,
          );
        }

        const updatedUser = await findTestUser(prisma, user.id);

        expect(updatedUser).toMatchObject({
          status: UserStatus.LOCKED,
        });

        const attempts = await loginAttemptStore.getAttempts(user.id);

        expect(attempts).toBe(MAX_FAILED_LOGIN_ATTEMPTS);
      } finally {
        await cleanupUser(loginAttemptStore, prisma, user.id);
      }
    });
  });

  describe('successful login security state', () => {
    it('should reset failed login attempts after successful login', async () => {
      const user = await createTestUser(prisma, passwordHasher);

      try {
        // Build failed-login state.
        await expect(loginUseCase.execute(user.username, WRONG_PASSWORD)).rejects.toBeInstanceOf(
          InvalidCredentialsDomainError,
        );

        const failedAttempts = await loginAttemptStore.getAttempts(user.id);

        expect(failedAttempts).toBe(1);

        // Successful login should clear Redis state.
        await loginUseCase.execute(user.username, TEST_PASSWORD);

        const attemptsAfterSuccess = await loginAttemptStore.getAttempts(user.id);

        expect(attemptsAfterSuccess).toBe(0);
      } finally {
        await cleanupUser(loginAttemptStore, prisma, user.id);
      }
    });

    it('should update lastLoginAt after successful login', async () => {
      const user = await createTestUser(prisma, passwordHasher, {
        lastLoginAt: null,
      });

      try {
        expect(user.lastLoginAt).toBeNull();

        await loginUseCase.execute(user.username, TEST_PASSWORD);

        const updatedUser = await findTestUser(prisma, user.id);

        expect(updatedUser?.lastLoginAt).toEqual(expect.any(Date));
      } finally {
        await cleanupUser(loginAttemptStore, prisma, user.id);
      }
    });
  });

  describe('access token', () => {
    it('should issue access token after successful login', async () => {
      const user = await createTestUser(prisma, passwordHasher);

      try {
        const result = await loginUseCase.execute(user.username, TEST_PASSWORD);

        expect(result.accessToken).toEqual(expect.any(String));

        expect(result.accessToken.length).toBeGreaterThan(0);

        expect(result.expiresIn).toEqual(expect.any(Number));

        expect(result.expiresIn).toBeGreaterThan(0);
      } finally {
        await cleanupUser(loginAttemptStore, prisma, user.id);
      }
    });
  });
});
