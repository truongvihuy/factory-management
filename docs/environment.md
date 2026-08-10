# Environment Configuration

This document defines how environment variables are configured, validated, mapped, and consumed by the Factory Management System.

---

## 1. Configuration Flow

The application follows a centralized configuration flow:

```text
.env
 │
 ▼
Environment Variables
 │
 ▼
Joi Validation
 │
 ▼
Configuration Mapping
 │
 ▼
NestJS ConfigService
 │
 ▼
Application
```

Environment variables are validated during application startup.

If required configuration is invalid or missing, the application must fail fast instead of starting with an invalid runtime state.

---

## 2. Configuration Responsibility

The configuration layer has three responsibilities:

1. Load environment variables.
2. Validate environment variables.
3. Map environment variables into application configuration.

The configuration layer does **not** create database clients, Redis clients, RabbitMQ connections, or other infrastructure resources.

Those responsibilities belong to their respective infrastructure modules.

---

## 3. Configuration Structure

The current configuration foundation is organized as:

```text
src/
└── config/
    ├── config.module.ts
    ├── configuration.ts
    └── env.validation.ts
```

### `config.module.ts`

Responsible for configuring and exposing NestJS `ConfigModule`.

```typescript
@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [configuration],
      validationSchema: envValidationSchema,
    }),
  ],
  exports: [ConfigModule],
})
export class AppConfigModule {}
```

### `configuration.ts`

Responsible for mapping environment variables into application configuration.

Example:

```typescript
export default () => ({
  app: {
    name: process.env.APP_NAME,
    environment: process.env.NODE_ENV,
    port: Number(process.env.PORT),
  },

  database: {
    url: process.env.DATABASE_URL,
  },

  redis: {
    url: process.env.REDIS_URL,
  },

  grpc: {
    host: process.env.GRPC_HOST,
    port: Number(process.env.GRPC_PORT),
  },

  messaging: {
    url: process.env.RABBITMQ_URL,
  },
});
```

### `env.validation.ts`

Responsible for validating environment variables before the application starts.

Joi is currently used for validation.

---

## 4. Environment Files

The repository should contain an example environment file:

```text
.env.example
```

Local development uses:

```text
.env
```

The real `.env` file must never be committed to Git.

```text
.env.example    → committed
.env            → ignored
```

---

## 5. Environment Variables

The Auth Service currently defines the following environment variables.

| Variable       | Required |            Default | Description               |
| -------------- | -------: | -----------------: | ------------------------- |
| `APP_NAME`     |       No | `fms-auth-service` | Application name          |
| `NODE_ENV`     |       No |      `development` | Runtime environment       |
| `PORT`         |       No |             `3001` | HTTP server port          |
| `DATABASE_URL` |      Yes |                  — | PostgreSQL connection URL |
| `REDIS_URL`    |      Yes |                  — | Redis connection URL      |
| `GRPC_HOST`    |       No |          `0.0.0.0` | gRPC server host          |
| `GRPC_PORT`    |       No |             `5001` | gRPC server port          |
| `RABBITMQ_URL` |      Yes |                  — | RabbitMQ connection URL   |

---

## 6. Example Environment

The repository should provide a safe example:

```env
APP_NAME=fms-auth-service
NODE_ENV=development
PORT=3001

DATABASE_URL=postgresql://postgres:postgres@localhost:5432/fms_auth

REDIS_URL=redis://localhost:6379

GRPC_HOST=0.0.0.0
GRPC_PORT=5001

RABBITMQ_URL=amqp://guest:guest@localhost:5672
```

The example file must contain development-safe placeholder credentials only.

Production credentials must never be stored in the repository.

---

## 7. Validation

Environment variables are validated during application startup.

Example:

```typescript
export const envValidationSchema = Joi.object({
  APP_NAME: Joi.string().default('fms-auth-service'),

  NODE_ENV: Joi.string().valid('development', 'test', 'production').default('development'),

  PORT: Joi.number().port().default(3001),

  DATABASE_URL: Joi.string().required(),

  REDIS_URL: Joi.string().required(),

  GRPC_HOST: Joi.string().default('0.0.0.0'),

  GRPC_PORT: Joi.number().port().default(5001),

  RABBITMQ_URL: Joi.string().required(),
});
```

Validation must happen before the application begins accepting requests.

---

## 8. Fail-Fast Behavior

Invalid configuration must prevent the application from starting.

Example:

```text
DATABASE_URL=invalid
```

Expected behavior:

```text
Application Startup
       │
       ▼
Environment Validation
       │
       ├── Invalid
       │
       ▼
Application exits
```

The application must not start and discover the configuration problem later during a database operation.

---

## 9. Accessing Configuration

Application code must access configuration through `ConfigService`.

Recommended:

```typescript
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DatabaseConfig {
  constructor(private readonly configService: ConfigService) {}

  get url(): string {
    return this.configService.getOrThrow<string>('database.url');
  }
}
```

---

## 10. Direct `process.env` Access

Direct access to `process.env` is restricted to the configuration layer.

Allowed:

```text
config/configuration.ts
```

Not allowed:

```typescript
process.env.DATABASE_URL;
process.env.REDIS_URL;
process.env.PORT;
```

inside business logic, controllers, services, repositories, or infrastructure implementations outside the configuration boundary.

### Incorrect

```typescript
@Injectable()
export class UserService {
  createUser() {
    const databaseUrl = process.env.DATABASE_URL;
  }
}
```

### Correct

```typescript
@Injectable()
export class UserService {
  constructor(private readonly configService: ConfigService) {}

  createUser() {
    const databaseUrl = this.configService.getOrThrow<string>('database.url');
  }
}
```

The objective is to prevent configuration access from being scattered throughout the codebase.

---

## 11. Configuration Naming

Environment variables use uppercase `SNAKE_CASE`.

Examples:

```text
APP_NAME
DATABASE_URL
REDIS_URL
GRPC_HOST
GRPC_PORT
RABBITMQ_URL
```

Application configuration uses structured lowercase keys.

Example:

```text
database.url
redis.url
grpc.host
grpc.port
messaging.url
```

This creates a clear boundary:

```text
Environment
DATABASE_URL
      │
      ▼
Configuration
database.url
      │
      ▼
ConfigService
```

---

## 12. Secrets Management

The following values must be treated as secrets or potentially sensitive configuration:

- Database credentials
- Redis credentials
- RabbitMQ credentials
- Authentication secrets
- JWT secrets
- Encryption keys
- API keys

These values must not be committed to Git.

Production secrets should be provided by the deployment environment or a dedicated secrets-management mechanism.

---

## 13. Environment Separation

The application recognizes:

```text
development
test
production
```

The environment is controlled by:

```env
NODE_ENV=development
```

Each environment should have independent configuration.

```text
Development
    │
    ├── Local PostgreSQL
    ├── Local Redis
    └── Local RabbitMQ

Test
    │
    ├── Test database
    ├── Test Redis
    └── Test messaging infrastructure

Production
    │
    ├── Production database
    ├── Production Redis
    └── Production messaging infrastructure
```

Production credentials must never be reused in local development.

---

## 14. Configuration Rules

The following rules apply across the project:

1. Environment variables are validated at startup.
2. Configuration access is centralized.
3. Application code uses `ConfigService`.
4. Direct `process.env` access is restricted to the configuration layer.
5. Secrets are never committed.
6. `.env.example` contains only safe example values.
7. Configuration failures must fail fast.
8. Configuration does not create infrastructure connections.
9. Each environment has independent configuration.
10. New environment variables must be documented.

---

## 15. Adding a New Environment Variable

When adding a new variable:

### Step 1

Add it to `.env.example`.

### Step 2

Add validation to:

```text
src/config/env.validation.ts
```

### Step 3

Map it in:

```text
src/config/configuration.ts
```

### Step 4

Access it through `ConfigService`.

### Step 5

Update this documentation.

Example:

```text
.env.example
      │
      ▼
env.validation.ts
      │
      ▼
configuration.ts
      │
      ▼
ConfigService
      │
      ▼
Application
```

A new environment variable is not considered complete until all five steps are implemented.

---

## 16. Verification

Configuration can be verified by:

```bash
yarn workspace @fms/auth-service typecheck
```

Then:

```bash
yarn workspace @fms/auth-service test
```

Finally:

```bash
yarn workspace @fms/auth-service dev
```

The application should:

- Start with valid configuration.
- Fail fast with invalid required configuration.
- Never expose secrets in logs.
- Never require direct `process.env` access outside the configuration boundary.
