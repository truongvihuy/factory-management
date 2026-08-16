import { InvalidCredentialsError } from '../../domain/errors/invalid-credentials.error';
import type { AuthenticationContextRepositoryPort } from '../../domain/ports/authentication-context.port';
import { AccountLoginRule } from '../../domain/rules/account-login.rule';
import { LoginSecurityPolicy } from '../policies/login-security.policy';
import type { AccessTokenIssuerPort } from '../ports/access-token-issuer.port';
import type { PasswordHasherPort } from '../ports/password-hasher.port';
import type { AuthenticationResult } from '../results/login.result';

export class LoginUseCase {
  constructor(
    private readonly repository: AuthenticationContextRepositoryPort,
    private readonly passwordHasher: PasswordHasherPort,
    private readonly accessTokenIssuer: AccessTokenIssuerPort,
    private readonly loginSecurityPolicy: LoginSecurityPolicy,
  ) {}

  async execute(identifier: string, password: string): Promise<AuthenticationResult> {
    const user = await this.repository.findByIdentifier(identifier);

    if (!user) {
      throw new InvalidCredentialsError();
    }

    AccountLoginRule.ensureCanLogin(user);

    const passwordValid = await this.passwordHasher.verify(password, user.passwordHash);

    if (!passwordValid) {
      await this.loginSecurityPolicy.handleFailedLogin(user);

      throw new InvalidCredentialsError();
    }

    await this.loginSecurityPolicy.handleSuccessfulLogin(user);

    const token = await this.accessTokenIssuer.issue({
      userId: user.id,
    });

    return {
      accessToken: token.accessToken,
      tokenType: 'Bearer',
      expiresIn: token.expiresIn,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        displayName: user.displayName,
      },
    };
  }
}
