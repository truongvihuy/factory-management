import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, type TestingModule } from '@nestjs/testing';
import request from 'supertest';

import { AccountInactiveError } from '../exceptions/account-inactive.error';
import { AccountLockedError } from '../exceptions/account-locked.error';
import { InvalidCredentialsError } from '../exceptions/invalid-credentials.error';
import { LoginUseCase } from '../services/login.use-case';
import { AuthenticationController } from './authentication.controller';

describe('AuthenticationController', () => {
  let app: INestApplication;
  const loginUseCase = {
    execute: jest.fn(),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthenticationController],
      providers: [
        {
          provide: LoginUseCase,
          useValue: loginUseCase,
        },
      ],
    }).compile();

    app = module.createNestApplication();

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /auth/login', () => {
    const loginPayload = {
      username: 'huy',
      password: 'password123',
    };

    it('should call LoginUseCase', async () => {
      loginUseCase.execute.mockResolvedValue({
        accessToken: 'mock-access-token',
        expiresIn: 900,
        user: {
          id: 'user-123',
          username: 'huy',
          email: 'huy@example.com',
          displayName: 'Huy',
        },
      });

      await request(app.getHttpServer()).post('/auth/login').send(loginPayload).expect(HttpStatus.OK);

      expect(loginUseCase.execute).toHaveBeenCalledTimes(1);

      expect(loginUseCase.execute).toHaveBeenCalledWith(loginPayload);
    });

    it('should return access token', async () => {
      loginUseCase.execute.mockResolvedValue({
        accessToken: 'mock-access-token',
        expiresIn: 900,
        user: {
          id: 'user-123',
          username: 'huy',
          email: 'huy@example.com',
          displayName: 'Huy',
        },
      });

      const response = await request(app.getHttpServer()).post('/auth/login').send(loginPayload).expect(HttpStatus.OK);

      expect(response.body.accessToken).toBe('mock-access-token');
    });

    it('should return tokenType Bearer', async () => {
      loginUseCase.execute.mockResolvedValue({
        accessToken: 'mock-access-token',
        expiresIn: 900,
        user: {
          id: 'user-123',
          username: 'huy',
          email: 'huy@example.com',
          displayName: 'Huy',
        },
      });

      const response = await request(app.getHttpServer()).post('/auth/login').send(loginPayload).expect(HttpStatus.OK);

      expect(response.body.tokenType).toBe('Bearer');
    });

    it('should return expiresIn', async () => {
      loginUseCase.execute.mockResolvedValue({
        accessToken: 'mock-access-token',
        expiresIn: 900,
        user: {
          id: 'user-123',
          username: 'huy',
          email: 'huy@example.com',
          displayName: 'Huy',
        },
      });

      const response = await request(app.getHttpServer()).post('/auth/login').send(loginPayload).expect(HttpStatus.OK);

      expect(response.body.expiresIn).toBe(900);
    });

    it('should return 401 when password is incorrect', async () => {
      loginUseCase.execute.mockRejectedValue(new InvalidCredentialsError('Invalid username or password'));

      await request(app.getHttpServer()).post('/auth/login').send(loginPayload).expect(HttpStatus.UNAUTHORIZED);
    });

    it('should return 423 when account is locked', async () => {
      loginUseCase.execute.mockRejectedValue(new AccountLockedError('Account is locked'));

      await request(app.getHttpServer()).post('/auth/login').send(loginPayload).expect(HttpStatus.LOCKED);
    });

    it('should return 403 when account is inactive', async () => {
      loginUseCase.execute.mockRejectedValue(new AccountInactiveError('Account is inactive'));

      await request(app.getHttpServer()).post('/auth/login').send(loginPayload).expect(HttpStatus.FORBIDDEN);
    });
  });
});
