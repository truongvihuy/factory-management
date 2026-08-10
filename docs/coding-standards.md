# Coding Standards

This document defines the coding standards and engineering conventions for the Factory Management System.

The purpose is to keep the codebase consistent, maintainable, testable, and scalable across all services.

These standards apply to all application services unless explicitly stated otherwise.

---

# 1. General Principles

The project follows these principles:

1. Prefer readability over cleverness.
2. Keep responsibilities small and explicit.
3. Follow established architectural boundaries.
4. Prefer strong typing over implicit behavior.
5. Validate data at system boundaries.
6. Keep business logic independent from infrastructure where practical.
7. Avoid unnecessary abstractions.
8. Avoid premature optimization.
9. Write code that is easy to test.
10. Make failure behavior explicit.

Code should be optimized for the next engineer who has to maintain it.

---

# 2. Language

The project uses:

```text
Node.js 22
TypeScript
ESM
```

TypeScript should be used for all application code.

JavaScript should not be introduced into application services unless there is a specific technical reason.

---

# 3. TypeScript

TypeScript strict mode is required.

Recommended compiler configuration includes:

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true
  }
}
```

The exact compiler configuration is defined by the repository TypeScript configuration.

---

# 4. Avoid `any`

Avoid:

```typescript
const data: any = response;
```

Prefer explicit types:

```typescript
const data: UserResponse = response;
```

If the type is genuinely unknown:

```typescript
const data: unknown = response;
```

Then validate or narrow the type before using it.

---

# 5. `unknown` Over `any`

When receiving external or untrusted data:

```typescript
function process(data: unknown) {
  // validate before use
}
```

Do not bypass type safety with:

```typescript
function process(data: any) {
  // ...
}
```

---

# 6. Null and Undefined

The codebase uses strict null checking.

Do not assume that an optional value exists.

Bad:

```typescript
const user = users.find(...);

return user.id;
```

Better:

```typescript
const user = users.find(...);

if (!user) {
  throw new UserNotFoundException();
}

return user.id;
```

---

# 7. Naming Conventions

## Classes

Use PascalCase:

```typescript
class AuthService {}
class UserRepository {}
class SessionController {}
```

---

## Interfaces

Use PascalCase.

Do not automatically prefix interfaces with `I`.

Preferred:

```typescript
interface UserRepository {}
```

Avoid:

```typescript
interface IUserRepository {}
```

---

## Types

Use PascalCase:

```typescript
type UserId = string;
type AuthenticatedUser = {
  id: string;
};
```

---

## Functions

Use camelCase:

```typescript
createUser();
validateCredentials();
findMachineById();
```

---

## Variables

Use camelCase:

```typescript
const userId = '...';
const machineStatus = 'online';
```

---

## Constants

Use descriptive names.

```typescript
const DEFAULT_PAGE_SIZE = 20;
const MAX_RETRY_ATTEMPTS = 3;
```

---

## Boolean Variables

Boolean names should communicate meaning.

Preferred:

```typescript
const isActive = true;
const hasPermission = false;
const canRetry = true;
```

Avoid:

```typescript
const active = true;
const permission = false;
```

---

# 8. File Naming

Use kebab-case for filenames.

Examples:

```text
auth.service.ts
user.repository.ts
session.controller.ts
machine-status.dto.ts
create-user.command.ts
```

Avoid:

```text
AuthService.ts
UserRepository.ts
createUserDto.ts
```

---

# 9. Import Order

Imports should be grouped consistently.

Recommended order:

```typescript
// External dependencies
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

// Internal application imports
import { UserRepository } from '../repositories/user.repository';

// Relative imports
import { CreateUserDto } from './dto/create-user.dto';
```

Do not duplicate imports from the same module.

Bad:

```typescript
import { Injectable } from '@nestjs/common';
import type { NestMiddleware } from '@nestjs/common';
```

Prefer:

```typescript
import { Injectable, type NestMiddleware } from '@nestjs/common';
```

ESLint should enforce import consistency.

---

# 10. Type-Only Imports

Use type-only imports when importing types:

```typescript
import type { User } from './types/user.type';
```

This prevents unnecessary runtime imports and makes the dependency intent explicit.

---

# 11. Explicit Return Types

Public methods should have explicit return types.

Preferred:

```typescript
async findUser(id: string): Promise<User> {
  // ...
}
```

Instead of relying entirely on inference:

```typescript
async findUser(id: string) {
  // ...
}
```

Private trivial functions may rely on inference when readability is not affected.

---

# 12. Functions

Functions should have a single clear responsibility.

Bad:

```typescript
async processUser() {
  // validate user
  // save user
  // send email
  // create audit record
  // publish event
}
```

Prefer decomposing responsibilities:

```text
Validate
   ↓
Persist
   ↓
Publish Event
   ↓
Audit
```

Each component should have a clear responsibility.

---

# 13. NestJS Dependency Injection

Use NestJS dependency injection rather than manually instantiating injectable dependencies.

Preferred:

```typescript
@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}
}
```

Avoid:

```typescript
const repository = new UserRepository();
```

Manual instantiation bypasses the dependency injection container and makes testing harder.

---

# 14. Dependency Injection Direction

Dependencies should point toward abstractions or stable boundaries where appropriate.

Example:

```text
Controller
    │
    ▼
Application Service
    │
    ▼
Repository
    │
    ▼
Infrastructure
```

Controllers should not directly contain database logic.

---

# 15. Controller Rules

Controllers should remain thin.

A controller should primarily:

- Receive requests
- Validate input
- Call application logic
- Map responses

Avoid putting business logic inside controllers.

Bad:

```typescript
@Post()
async create(@Body() dto: CreateUserDto) {
  if (dto.email.endsWith('@example.com')) {
    // business logic
  }

  // database logic
}
```

Prefer:

```text
Controller
    ↓
Application Service
    ↓
Domain / Repository
```

---

# 16. Service Rules

Application services coordinate business operations.

They should not become "god classes".

If a service becomes responsible for:

```text
Authentication
Users
Sessions
Permissions
Email
Audit
Reporting
```

it should be reviewed for responsibility boundaries.

---

# 17. Repository Rules

Repositories abstract persistence operations.

Example:

```typescript
interface UserRepository {
  findById(id: string): Promise<User | null>;
  save(user: User): Promise<User>;
}
```

The repository should not contain unrelated business logic.

---

# 18. Database Access

Application services must not directly access Prisma clients when repository abstraction is established for that domain.

Preferred:

```text
Application Service
       │
       ▼
Repository
       │
       ▼
Prisma
       │
       ▼
Database
```

Avoid:

```text
Controller
    │
    ▼
Prisma
```

---

# 19. Prisma

Prisma should be treated as an infrastructure/persistence concern.

Do not expose Prisma models throughout the entire application layer unless there is a deliberate reason.

Prefer application/domain types where appropriate.

Example:

```text
Prisma Model
    ↓
Repository
    ↓
Application Model
```

This reduces coupling between business logic and persistence implementation.

---

# 20. DTOs

DTOs define transport-layer contracts.

Examples:

```text
CreateUserDto
UpdateUserDto
LoginDto
CreateMachineDto
```

DTOs should be validated at the boundary.

Do not use DTOs as a replacement for domain models in every layer.

---

# 21. Validation

All external input must be validated.

Validation applies to:

- REST requests
- gRPC requests
- Environment variables
- Event payloads
- External integrations

Never assume external input is trustworthy.

---

# 22. Environment Variables

Application code outside the configuration layer must not directly access:

```typescript
process.env.*
```

Environment variables should be loaded and validated by the configuration module.

Preferred:

```typescript
constructor(
  private readonly configService: ConfigService,
) {}
```

Then:

```typescript
this.configService.get<string>('database.url');
```

The configuration layer is responsible for:

1. Reading environment variables.
2. Validating them.
3. Applying defaults.
4. Exposing typed configuration.

---

# 23. Error Handling

Do not silently swallow errors.

Bad:

```typescript
try {
  await repository.save(user);
} catch {
  return null;
}
```

If an error is intentionally handled, the reason should be explicit.

```typescript
try {
  await repository.save(user);
} catch (error) {
  this.logger.error('Failed to save user', error);

  throw error;
}
```

---

# 24. Exceptions

Use meaningful domain/application exceptions.

Avoid generic errors when a more precise error exists.

Bad:

```typescript
throw new Error('User not found');
```

Prefer:

```typescript
throw new UserNotFoundException(userId);
```

Exception mapping should happen at the appropriate transport boundary.

---

# 25. Logging

Use the project's centralized logger.

Do not use:

```typescript
console.log();
console.error();
```

inside application code unless there is a deliberate infrastructure-level reason.

Logs should contain useful context.

Example:

```typescript
this.logger.info('User authenticated', {
  userId,
  requestId,
});
```

Never log:

- Passwords
- Access tokens
- Refresh tokens
- Session secrets
- Sensitive credentials

---

# 26. Logging Levels

Use appropriate levels.

```text
DEBUG
INFO
WARN
ERROR
```

### DEBUG

Detailed information useful during development or troubleshooting.

### INFO

Normal application lifecycle events.

### WARN

Unexpected but recoverable conditions.

### ERROR

Failures requiring investigation.

---

# 27. Correlation and Trace IDs

Requests and asynchronous events should preserve correlation information.

Example:

```text
Request
  │
  ▼
API Gateway
  │
  │ traceId
  ▼
Auth Service
  │
  │ traceId
  ▼
RabbitMQ
  │
  ▼
Audit Service
```

Logs should make it possible to correlate related operations.

---

# 28. REST API Standards

REST APIs exposed through the API Gateway should use consistent resource-oriented naming.

Preferred:

```text
GET    /users
GET    /users/:id
POST   /users
PATCH  /users/:id
DELETE /users/:id
```

Avoid action-oriented paths where a resource-oriented design is possible:

```text
POST /createUser
POST /deleteUser
```

---

# 29. HTTP Status Codes

Use standard HTTP semantics.

Examples:

```text
200 OK
201 Created
204 No Content
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
409 Conflict
422 Unprocessable Entity
429 Too Many Requests
500 Internal Server Error
503 Service Unavailable
```

The exact status should reflect the actual failure semantics.

---

# 30. gRPC Standards

Internal gRPC APIs should be contract-first.

Contracts should be defined using Protocol Buffers.

Example:

```text
.proto
   │
   ▼
Generated Types
   │
   ▼
gRPC Client / Server
```

Do not manually duplicate gRPC contracts in TypeScript.

---

# 31. gRPC Error Handling

Use appropriate gRPC status codes.

Examples:

```text
INVALID_ARGUMENT
UNAUTHENTICATED
PERMISSION_DENIED
NOT_FOUND
ALREADY_EXISTS
FAILED_PRECONDITION
DEADLINE_EXCEEDED
UNAVAILABLE
INTERNAL
```

Avoid exposing internal implementation details through gRPC errors.

---

# 32. Event Standards

Events should represent meaningful facts.

Preferred:

```text
UserCreated
MachineRegistered
TelemetryReceived
AlertCreated
IncidentResolved
MaintenanceCompleted
```

Avoid events that describe implementation details:

```text
UserRepositoryInsertExecuted
PrismaQueryCompleted
```

---

# 33. Event Naming

Event names should be stable and domain-oriented.

Recommended format:

```text
<entity>.<action>
```

Examples:

```text
user.created
machine.registered
telemetry.received
alert.created
incident.resolved
```

---

# 34. Event Payload

Events should include metadata necessary for tracing and processing.

Example:

```typescript
interface DomainEvent<T> {
  eventId: string;
  eventType: string;
  version: number;
  occurredAt: string;
  source: string;
  correlationId?: string;
  data: T;
}
```

Do not put unnecessary data into events.

---

# 35. Event Consumers

Consumers must be idempotent.

The same event may be delivered more than once.

Bad:

```text
Receive Event
   ↓
Create Record
```

Potential result:

```text
Event A
Event A
   ↓
Duplicate Records
```

Preferred:

```text
Receive Event
   ↓
Check eventId
   ↓
Already Processed?
   ├── Yes → Ignore
   └── No  → Process
```

---

# 36. Transactional Outbox

When a database transaction and event publication must remain consistent, use Transactional Outbox.

Do not:

```text
Save Database
     ↓
Publish Event
```

without handling the failure window.

Preferred:

```text
Database Transaction
    │
    ├── Business Data
    └── Outbox Event
            │
            ▼
          Commit
            │
            ▼
      Event Publisher
            │
            ▼
         RabbitMQ
```

---

# 37. Async Code

Prefer `async/await`.

Preferred:

```typescript
const user = await repository.findById(id);
```

Avoid unnecessary promise chains:

```typescript
repository
  .findById(id)
  .then(...)
  .catch(...);
```

Promise chains may still be used when they improve readability or are required by an API.

---

# 38. Promise Handling

Do not create unnecessary floating promises.

Bad:

```typescript
this.publishEvent();
```

when the operation must complete successfully.

Prefer:

```typescript
await this.publishEvent();
```

If intentionally fire-and-forget, make that decision explicit and ensure failure handling exists.

---

# 39. Concurrency

Be explicit about concurrent operations.

Avoid accidental parallel execution:

```typescript
await operationA();
await operationB();
```

If operations are independent and can safely run concurrently:

```typescript
await Promise.all([operationA(), operationB()]);
```

Do not use parallel execution when operations depend on one another.

---

# 40. Transactions

Use database transactions when multiple related operations must succeed or fail together.

Example:

```text
Transaction
 ├── Update User
 ├── Create Session
 └── Create Outbox Event
```

Do not use transactions unnecessarily for independent operations.

---

# 41. Idempotency

Operations that may be retried must be designed for idempotency where required.

This is especially important for:

- Event consumers
- Message processing
- Payment-like workflows
- External integrations
- Retryable commands

---

# 42. Pagination

Collection endpoints should use a consistent pagination strategy.

Example:

```text
GET /machines?page=1&limit=20
```

or cursor-based pagination where the workload requires it.

The pagination strategy should be consistent within a service/API family.

---

# 43. API Response Design

Responses should be predictable.

Avoid returning inconsistent structures:

```json
{
  "data": {}
}
```

for one endpoint and:

```json
{
  "result": {}
}
```

for another.

The API contract should define a consistent response format.

---

# 44. Business Logic

Business rules should not live inside:

- Controllers
- DTOs
- Prisma schema
- Database-specific code

Business logic should live in appropriate application/domain components.

---

# 45. Cross-Service Business Logic

Do not duplicate another service's business rules.

Example:

```text
Factory Service
    │
    └── owns machine ownership rules
```

Other services should obtain required information through:

```text
gRPC
```

or:

```text
Events
```

rather than copying the entire rule set.

---

# 46. Service Boundary

A service must own its domain.

Example:

```text
Factory Service
 ├── Organization
 ├── Factory
 ├── Production Line
 ├── Machine
 └── Sensor
```

Another service must not directly modify these records.

---

# 47. Shared Code

Shared code should be introduced carefully.

Good candidates:

- Logging utilities
- Error primitives
- Common transport types
- Observability helpers
- Infrastructure utilities

Do not create a shared package simply because two files contain similar code.

Shared code creates coupling.

---

# 48. Avoid the Distributed Monolith

Microservices should remain independently understandable.

Avoid:

```text
Service A
   │
   ├── requires B
   ├── requires C
   ├── requires D
   └── requires E
```

for every request.

Excessive synchronous dependencies create a distributed monolith.

Prefer asynchronous communication when immediate responses are not required.

---

# 49. Database Boundary

Never access another service's database directly.

Forbidden:

```text
Service A
   │
   └──────► Service B Database
```

Required:

```text
Service A
   │
   ├── gRPC
   └── Events
        │
        ▼
Service B
   │
   ▼
Service B Database
```

---

# 50. Configuration

Configuration must be centralized.

Application code should consume validated configuration through the configuration module.

Do not scatter:

```typescript
process.env.DATABASE_URL;
process.env.REDIS_URL;
process.env.RABBITMQ_URL;
```

throughout the application.

---

# 51. Secrets

Secrets must never be committed to Git.

Forbidden:

```text
DATABASE_URL=postgres://user:password@...
JWT_SECRET=...
```

inside committed configuration files.

Use environment variables or a secret-management mechanism.

---

# 52. Comments

Comments should explain **why**, not simply repeat **what** the code does.

Bad:

```typescript
// Increment counter
counter++;
```

Good:

```typescript
// Increment the retry count before publishing so
// failed deliveries cannot exceed the configured limit.
counter++;
```

---

# 53. TODO

TODO comments should be actionable.

Good:

```typescript
// TODO: Replace temporary retry policy with configurable backoff.
```

Avoid:

```typescript
// TODO: fix this
```

If the work is significant, create a task/issue instead.

---

# 54. Magic Numbers

Avoid unexplained magic numbers.

Bad:

```typescript
if (retryCount > 3) {
}
```

Prefer:

```typescript
const MAX_RETRY_ATTEMPTS = 3;

if (retryCount > MAX_RETRY_ATTEMPTS) {
}
```

---

# 55. Early Returns

Use early returns when they improve readability.

Preferred:

```typescript
if (!user) {
  throw new UserNotFoundException();
}

if (!user.isActive) {
  throw new UserInactiveException();
}

return user;
```

Avoid unnecessarily deep nesting.

---

# 56. Immutability

Prefer immutable values where practical.

Use:

```typescript
const
```

by default.

Use `let` only when reassignment is required.

Avoid mutation of shared objects unless explicitly intended.

---

# 57. Dependency Direction

The preferred dependency direction is:

```text
Transport
    ↓
Application
    ↓
Domain
    ↓
Infrastructure
```

Infrastructure details should not leak upward unnecessarily.

---

# 58. Architecture Compliance

Code must follow the architecture defined in:

```text
docs/architecture.md
```

If implementation requires breaking an architectural boundary:

```text
Identify Problem
      ↓
Evaluate Alternatives
      ↓
Create ADR
      ↓
Make Decision
      ↓
Update Architecture Documentation
      ↓
Implement
```

Do not silently introduce architectural changes through code.

---

# 59. Formatting

Code formatting is automated.

Developers should not manually debate formatting conventions during code review.

The repository formatter and ESLint configuration are the source of truth.

---

# 60. ESLint

ESLint is used to enforce code quality and consistency.

Linting should detect:

- Unused variables
- Duplicate imports
- Unsafe patterns
- TypeScript issues
- Import violations
- Inconsistent conventions

Example:

```bash
yarn workspace @fms/auth-service lint
```

---

# 61. Typecheck

Every service must pass TypeScript type checking.

Example:

```bash
yarn workspace @fms/auth-service typecheck
```

Type errors should not be ignored.

---

# 62. Build Verification

Every service must be buildable independently.

Example:

```bash
yarn workspace @fms/auth-service build
```

A successful typecheck does not replace build verification.

---

# 63. Testing

Code should be accompanied by appropriate tests.

Minimum expectations:

```text
Business Logic
    ↓
Unit Tests

Infrastructure Boundary
    ↓
Integration Tests

Critical Workflow
    ↓
E2E Tests
```

See:

```text
docs/testing.md
```

for the complete testing strategy.

---

# 64. Code Review

Code review should focus on:

1. Correctness
2. Business behavior
3. Architecture
4. Security
5. Error handling
6. Testability
7. Performance
8. Maintainability

Reviewers should not spend significant time manually checking formatting already enforced by tooling.

---

# 65. Definition of Done

A change is considered complete when:

```text
Implementation
     ↓
Typecheck
     ↓
Lint
     ↓
Tests
     ↓
Build
     ↓
Documentation
     ↓
Code Review
```

The exact CI quality gate may evolve as the project progresses.

---

# 66. Core Engineering Rules

The following rules are considered non-negotiable:

1. Do not bypass service boundaries.
2. Do not access another service's database.
3. Do not scatter `process.env.*` throughout application code.
4. Do not use `any` without a documented reason.
5. Do not put business logic in controllers.
6. Do not silently swallow errors.
7. Do not log secrets.
8. Do not create non-idempotent consumers for retryable events.
9. Do not introduce architectural changes without a documented decision.
10. Do not sacrifice maintainability for unnecessary abstraction.

---

# 67. Final Principle

The objective of these standards is not to make every line of code look identical.

The objective is to make the system predictable.

A developer should be able to move from:

```text
Auth Service
```

to:

```text
Factory Service
```

to:

```text
Telemetry Service
```

and still understand:

- where business logic belongs,
- how dependencies are injected,
- how configuration is accessed,
- how errors are handled,
- how data is persisted,
- how services communicate,
- how events are published,
- how tests are structured,
- and how the service is observed.

Consistency is a tool for reducing cognitive load, not bureaucracy.
