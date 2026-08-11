import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';

import { AppModule } from '../../src/app.module';
import { UserStatus } from '../../src/infrastructure/database/prisma/generated';
import { PrismaService } from '../../src/infrastructure/database/prisma/prisma.service';
import { Argon2PasswordHasherService } from '../../src/infrastructure/security/password/argon2-password-hasher.service';

describe('Authentication E2E', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let passwordHasher: Argon2PasswordHasherService;

  const loginPayload = {
    identifier: 'e2e-huy',
    password: 'password123',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    await app.init();

    prisma = moduleFixture.get<PrismaService>(PrismaService);

    passwordHasher = moduleFixture.get<Argon2PasswordHasherService>(Argon2PasswordHasherService);
  });

  afterAll(async () => {
    await prisma.user.deleteMany({
      where: {
        username: {
          startsWith: 'e2e-',
        },
      },
    });

    await app.close();
  });

  beforeEach(async () => {
    await prisma.user.deleteMany({
      where: {
        username: {
          startsWith: 'e2e-',
        },
      },
    });
  });

  async function createUser(options?: { username?: string; password?: string; status?: UserStatus }) {
    const username = options?.username ?? 'e2e-huy';

    const password = options?.password ?? 'password123';

    const passwordHash = await passwordHasher.hash(password);

    return prisma.user.create({
      data: {
        username,
        email: `${username}@example.com`,
        displayName: 'E2E Huy',
        passwordHash,
        status: options?.status ?? UserStatus.ACTIVE,
        failedLoginAttempts: 0,
        lockedUntil: null,
        lastLoginAt: null,
      },
    });
  }

  describe('POST /auth/login', () => {
    it('should login successfully with valid credentials', async () => {
      await createUser();

      const response = await request(app.getHttpServer()).post('/auth/login').send(loginPayload).expect(HttpStatus.OK);

      expect(response.body).toBeDefined();
    });

    it('should return accessToken', async () => {
      await createUser();

      const response = await request(app.getHttpServer()).post('/auth/login').send(loginPayload).expect(HttpStatus.OK);

      expect(response.body.accessToken).toBeDefined();
      expect(typeof response.body.accessToken).toBe('string');
      expect(response.body.accessToken.length).toBeGreaterThan(0);
    });

    it('should return tokenType Bearer', async () => {
      await createUser();

      const response = await request(app.getHttpServer()).post('/auth/login').send(loginPayload).expect(HttpStatus.OK);

      expect(response.body.tokenType).toBe('Bearer');
    });

    it('should return expiresIn', async () => {
      await createUser();

      const response = await request(app.getHttpServer()).post('/auth/login').send(loginPayload).expect(HttpStatus.OK);

      expect(response.body.expiresIn).toBeDefined();
      expect(typeof response.body.expiresIn).toBe('number');
      expect(response.body.expiresIn).toBeGreaterThan(0);
    });

    it('should return 401 when password is incorrect', async () => {
      await createUser();

      await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          identifier: 'e2e-huy',
          password: 'wrong-password',
        })
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should return 403 when account is inactive', async () => {
      await createUser({
        username: 'e2e-inactive',
        status: UserStatus.INACTIVE,
      });

      await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          identifier: 'e2e-inactive',
          password: 'password123',
        })
        .expect(HttpStatus.FORBIDDEN);
    });

    it('should return 423 when account is locked', async () => {
      await createUser({
        username: 'e2e-locked',
        status: UserStatus.LOCKED,
      });

      await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          identifier: 'e2e-locked',
          password: 'password123',
        })
        .expect(HttpStatus.LOCKED);
    });
  });
});
