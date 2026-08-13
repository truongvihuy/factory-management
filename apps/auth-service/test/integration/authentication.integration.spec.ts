import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { Test, type TestingModule } from '@nestjs/testing';

import { AppConfigModule } from '../../src/common/config/config.module';
import { UserStatus } from '../../src/infrastructure/database/prisma/generated';
import { PrismaModule } from '../../src/infrastructure/database/prisma/prisma.module';
import { PrismaService } from '../../src/infrastructure/database/prisma/prisma.service';
import { PrismaUserRepository } from '../../src/infrastructure/database/prisma/repositories/user.repository';
import { Argon2PasswordHasherService } from '../../src/infrastructure/security/password/argon2-password-hasher.service';
import { JwtAccessTokenIssuerService } from '../../src/infrastructure/security/token/jwt-access-token-issuer.service';
import { AccountInactiveError } from '../../src/modules/authentication/exceptions/account-inactive.error';
import { AccountLockedError } from '../../src/modules/authentication/exceptions/account-locked.error';
import { InvalidCredentialsError } from '../../src/modules/authentication/exceptions/invalid-credentials.error';
import { LoginSecurityPolicy } from '../../src/modules/authentication/services/login-security.policy';
import { LoginUseCase } from '../../src/modules/authentication/services/login.use-case';
import { createTestUser, deleteTestUser, findTestUser } from '../helpers/authentication-test.helper';

describe('Authentication Integration', () => {
  let module: TestingModule;
  let prisma: PrismaService;
  let loginUseCase: LoginUseCase;
  let passwordHasher: Argon2PasswordHasherService;

  const TEST_PASSWORD = 'password123';
  const WRONG_PASSWORD = 'wrong-password';
  let MAX_FAILED_LOGIN_ATTEMPTS = 5;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        AppConfigModule,
        PrismaModule,
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
          provide: 'PASSWORD_HANSHER',
          useClass: Argon2PasswordHasherService,
        },
        {
          provide: 'ACCESS_TOKEN_ISSUER',
          useClass: JwtAccessTokenIssuerService,
        },
        {
          provide: 'USER_REPOSITORY',
          useClass: PrismaUserRepository,
        },
        LoginSecurityPolicy,
        LoginUseCase,
      ],
    }).compile();

    prisma = module.get<PrismaService>(PrismaService);
    passwordHasher = module.get<Argon2PasswordHasherService>('PASSWORD_HANSHER');
    loginUseCase = module.get<LoginUseCase>(LoginUseCase);
    const configService = module.get<ConfigService>(ConfigService);
    MAX_FAILED_LOGIN_ATTEMPTS = configService.getOrThrow<number>('authentication.security.maxLoginAttempts');

    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await module.close();
  });

  describe('valid credentials', () => {
    it('should login successfully', async () => {
      const user = await createTestUser(prisma, passwordHasher, {
        password: TEST_PASSWORD,
      });

      const result = await loginUseCase.execute(user.username, TEST_PASSWORD);

      expect(result).toMatchObject({
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          displayName: user.displayName,
        },
      });

      expect(result.accessToken).toEqual(expect.any(String));
      expect(result.accessToken.length).toBeGreaterThan(0);
      expect(result.expiresIn).toBeGreaterThan(0);

      await deleteTestUser(prisma, user.id);
    });
  });

  describe('invalid password', () => {
    it('should reject invalid password', async () => {
      const user = await createTestUser(prisma, passwordHasher);

      await expect(loginUseCase.execute(user.username, WRONG_PASSWORD)).rejects.toBeInstanceOf(InvalidCredentialsError);

      await deleteTestUser(prisma, user.id);
    });
  });

  describe('unknown user', () => {
    it('should reject unknown user', async () => {
      await expect(loginUseCase.execute('integration-user-not-found', TEST_PASSWORD)).rejects.toBeInstanceOf(
        InvalidCredentialsError,
      );
    });
  });

  describe('inactive user', () => {
    it('should reject inactive user', async () => {
      const user = await createTestUser(prisma, passwordHasher, {
        status: UserStatus.INACTIVE,
      });

      await expect(loginUseCase.execute(user.username, TEST_PASSWORD)).rejects.toBeInstanceOf(AccountInactiveError);

      await deleteTestUser(prisma, user.id);
    });
  });

  describe('locked user', () => {
    it('should reject locked user', async () => {
      const user = await createTestUser(prisma, passwordHasher, {
        status: UserStatus.LOCKED,
        failedLoginAttempts: MAX_FAILED_LOGIN_ATTEMPTS,
      });

      await expect(loginUseCase.execute(user.username, TEST_PASSWORD)).rejects.toBeInstanceOf(AccountLockedError);

      await deleteTestUser(prisma, user.id);
    });
  });

  describe('failed login attempts', () => {
    it('should increment failed login attempts', async () => {
      const user = await createTestUser(prisma, passwordHasher);

      await expect(loginUseCase.execute(user.username, WRONG_PASSWORD)).rejects.toBeInstanceOf(InvalidCredentialsError);

      const updatedUser = await findTestUser(prisma, user.id);

      expect(updatedUser?.failedLoginAttempts).toBe(1);

      await deleteTestUser(prisma, user.id);
    });
  });

  describe('account lock threshold', () => {
    it('should lock account after reaching threshold', async () => {
      const user = await createTestUser(prisma, passwordHasher, {
        failedLoginAttempts: MAX_FAILED_LOGIN_ATTEMPTS - 1,
      });

      console.log(user);

      await expect(loginUseCase.execute(user.username, WRONG_PASSWORD)).rejects.toBeInstanceOf(InvalidCredentialsError);

      const updatedUser = await findTestUser(prisma, user.id);

      console.log(updatedUser);

      expect(updatedUser).toMatchObject({
        failedLoginAttempts: MAX_FAILED_LOGIN_ATTEMPTS,
        status: UserStatus.LOCKED,
      });

      await deleteTestUser(prisma, user.id);
    });
  });

  describe('successful login security state', () => {
    it('should reset failed login attempts', async () => {
      const user = await createTestUser(prisma, passwordHasher, {
        failedLoginAttempts: 3,
      });

      await loginUseCase.execute(user.username, TEST_PASSWORD);

      const updatedUser = await findTestUser(prisma, user.id);

      expect(updatedUser?.failedLoginAttempts).toBe(0);

      await deleteTestUser(prisma, user.id);
    });

    it('should update lastLoginAt', async () => {
      const user = await createTestUser(prisma, passwordHasher, {
        lastLoginAt: null,
      });

      await loginUseCase.execute(user.username, TEST_PASSWORD);

      const updatedUser = await findTestUser(prisma, user.id);

      expect(updatedUser?.lastLoginAt).toEqual(expect.any(Date));

      await deleteTestUser(prisma, user.id);
    });
  });

  describe('access token', () => {
    it('should issue access token after successful login', async () => {
      const user = await createTestUser(prisma, passwordHasher);

      const result = await loginUseCase.execute(user.username, TEST_PASSWORD);

      expect(result.accessToken).toEqual(expect.any(String));

      expect(result.accessToken.length).toBeGreaterThan(0);

      expect(result.expiresIn).toEqual(expect.any(Number));

      expect(result.expiresIn).toBeGreaterThan(0);

      await deleteTestUser(prisma, user.id);
    });
  });
});
