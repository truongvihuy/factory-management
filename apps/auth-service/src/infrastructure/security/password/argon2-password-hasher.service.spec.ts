import { Argon2PasswordHasherService } from './argon2-password-hasher.service';

describe('Argon2PasswordHasherService', () => {
  let service: Argon2PasswordHasherService;

  const password = 'StrongPassword123!';

  beforeEach(() => {
    service = new Argon2PasswordHasherService();
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

      await expect(service.verify(password, invalidHash)).resolves.toBe(false);
    });
  });
});
