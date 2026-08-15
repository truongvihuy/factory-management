export class LoginIdentifier {
  private constructor(private readonly value: string) {}

  static create(value: string): LoginIdentifier {
    const normalized = value.trim();

    if (!normalized) {
      throw new Error('Login identifier cannot be empty');
    }

    return new LoginIdentifier(normalized);
  }

  getValue(): string {
    return this.value;
  }

  equals(other: LoginIdentifier): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
