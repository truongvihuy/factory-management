import { HttpStatus, type INestApplication } from '@nestjs/common';
import { Test, type TestingModule } from '@nestjs/testing';
import request from 'supertest';

import { AppModule } from '../../src/app.module';
import { PASSWORD_HANSHER } from '../../src/common/constants/authentication.constants';
import { UserStatus } from '../../src/infrastructure/database/prisma/generated';
import { PrismaService } from '../../src/infrastructure/database/prisma/prisma.service';
import { PasswordHasher } from '../../src/modules/authentication/interfaces/password-hasher.interface';

describe('Authentication E2E', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let passwordHasher: PasswordHasher;

  const TEST_PASSWORD = 'password123';
  const WRONG_PASSWORD = 'wrong-password';

  const createLoginPayload = (identifier: string, password: string = TEST_PASSWORD) => ({
    identifier,
    password,
  });

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    await app.init();

    prisma = moduleFixture.get<PrismaService>(PrismaService);
    passwordHasher = moduleFixture.get<PasswordHasher>(PASSWORD_HANSHER);
  });

  afterAll(async () => {
    await app.close();
  });

  afterEach(async () => {
    await prisma.user.deleteMany({
      where: {
        username: {
          startsWith: 'e2e-',
        },
      },
    });
  });

  async function createUser(
    options: {
      username?: string;
      password?: string;
      status?: UserStatus;
    } = {},
  ) {
    const username = options.username ?? 'e2e-fms-test';
    const password = options.password ?? TEST_PASSWORD;

    const passwordHash = await passwordHasher.hash(password);

    return prisma.user.create({
      data: {
        username,
        email: `${username}@example.com`,
        displayName: 'E2E Huy',
        passwordHash,
        status: options.status ?? UserStatus.ACTIVE,
        failedLoginAttempts: 0,
        lockedUntil: null,
        lastLoginAt: null,
      },
    });
  }

  async function login(identifier: string, password: string = TEST_PASSWORD) {
    return request(app.getHttpServer()).post('/auth/login').send(createLoginPayload(identifier, password));
  }

  describe('POST /auth/login', () => {
    describe('successful authentication', () => {
      it('should return 200 with authentication result', async () => {
        const user = await createUser();

        const response = await login(user.username);

        expect(response.status).toBe(HttpStatus.OK);

        expect(response.body).toMatchObject({
          tokenType: 'Bearer',
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            displayName: user.displayName,
          },
        });

        expect(response.body.accessToken).toEqual(expect.any(String));

        expect(response.body.expiresIn).toEqual(expect.any(Number));
      });

      it('should return a valid access token', async () => {
        const user = await createUser();

        const response = await login(user.username);

        expect(response.body.accessToken).toEqual(expect.any(String));

        expect(response.body.accessToken.length).toBeGreaterThan(0);
      });

      it('should return Bearer token type', async () => {
        const user = await createUser();

        const response = await login(user.username);

        expect(response.body.tokenType).toBe('Bearer');
      });

      it('should return positive expiresIn', async () => {
        const user = await createUser();

        const response = await login(user.username);

        expect(response.body.expiresIn).toEqual(expect.any(Number));

        expect(response.body.expiresIn).toBeGreaterThan(0);
      });
    });

    describe('authentication failure', () => {
      it('should return 401 when password is incorrect', async () => {
        const user = await createUser();

        const response = await login(user.username, WRONG_PASSWORD);

        expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
      });

      it('should return 403 when account is inactive', async () => {
        const user = await createUser({
          username: 'e2e-inactive',
          status: UserStatus.INACTIVE,
        });

        const response = await login(user.username);

        expect(response.status).toBe(HttpStatus.FORBIDDEN);
      });

      it('should return 423 when account is locked', async () => {
        const user = await createUser({
          username: 'e2e-locked',
          status: UserStatus.LOCKED,
        });

        const response = await login(user.username);

        expect(response.status).toBe(HttpStatus.LOCKED);
      });
    });
  });
});
