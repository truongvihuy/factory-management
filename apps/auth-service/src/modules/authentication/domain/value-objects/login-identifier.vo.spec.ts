import { LoginIdentifier } from './login-identifier.vo';

describe('LoginIdentifier', () => {
  describe('create', () => {
    it('should create identifier with valid value', () => {
      const identifier = LoginIdentifier.create('huy');

      expect(identifier.getValue()).toBe('huy');
    });

    it('should trim surrounding whitespace', () => {
      const identifier = LoginIdentifier.create('  huy  ');

      expect(identifier.getValue()).toBe('huy');
    });

    it('should reject empty identifier', () => {
      expect(() => LoginIdentifier.create('')).toThrow('Login identifier cannot be empty');
    });

    it('should reject whitespace-only identifier', () => {
      expect(() => LoginIdentifier.create('   ')).toThrow('Login identifier cannot be empty');
    });
  });

  describe('equals', () => {
    it('should return true for equal identifiers', () => {
      const first = LoginIdentifier.create('huy');
      const second = LoginIdentifier.create('huy');

      expect(first.equals(second)).toBe(true);
    });

    it('should return false for different identifiers', () => {
      const first = LoginIdentifier.create('huy');
      const second = LoginIdentifier.create('admin');

      expect(first.equals(second)).toBe(false);
    });
  });

  describe('toString', () => {
    it('should return identifier value', () => {
      const identifier = LoginIdentifier.create('huy');

      expect(identifier.toString()).toBe('huy');
    });
  });
});
