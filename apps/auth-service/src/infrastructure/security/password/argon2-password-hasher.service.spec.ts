import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { Argon2PasswordHasherService } from './argon2-password-hasher.service';

describe('Argon2PasswordHasherService', () => {
  let service: Argon2PasswordHasherService;
  let configService: {
    getOrThrow: jest.Mock;
  };

  const password = 'StrongPassword123!';

  beforeEach(async () => {
    configService = {
      getOrThrow: jest.fn().mockImplementation((key: string) => {
        const config = {
          'authentication.password.memoryCost': 32768,
          'authentication.password.timeCost': 2,
          'authentication.password.parallelism': 1,
        };

        return config[key as keyof typeof config];
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        Argon2PasswordHasherService,
        {
          provide: ConfigService,
          useValue: configService,
        },
      ],
    }).compile();

    service = module.get<Argon2PasswordHasherService>(Argon2PasswordHasherService);
  });

  describe('hash()', () => {
    it('should hash password', async () => {
      const hash = await service.hash(password);

      expect(hash).toBeDefined();
      expect(typeof hash).toBe('string');
      expect(hash.length).toBeGreaterThan(0);
    });

    it('should not return plaintext password', async () => {
      const hash = await service.hash(password);

      expect(hash).not.toBe(password);
    });

    it('should generate different hashes for the same password', async () => {
      const hash1 = await service.hash(password);
      const hash2 = await service.hash(password);

      expect(hash1).not.toBe(hash2);
    });
  });

  describe('verify()', () => {
    it('should return true for correct password', async () => {
      const hash = await service.hash(password);

      const result = await service.verify(password, hash);

      expect(result).toBe(true);
    });

    it('should return false for incorrect password', async () => {
      const hash = await service.hash(password);

      const result = await service.verify('WrongPassword123!', hash);

      expect(result).toBe(false);
    });

    it('should handle invalid hash safely', async () => {
      const invalidHash = 'invalid-hash';

      const result = await service.verify(password, invalidHash);

      expect(result).toBe(false);
    });

    describe('Argon2PasswordHasherService configuration', () => {
      it('should use configured Argon2 parameters', async () => {
        const hash = await service.hash('password123');

        expect(hash).toContain('$argon2id$');
        expect(hash).toContain('m=32768,t=2,p=1');
      });
    });
  });
});
