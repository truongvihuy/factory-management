# Testing Strategy

This document defines the testing strategy, testing layers, conventions, and verification process for the Factory Management System.

The goal is to ensure that each service is reliable, testable, and safe to evolve independently.

---

## 1. Testing Philosophy

The project follows these principles:

1. Test behavior rather than implementation details.
2. Unit tests should be fast and isolated.
3. Integration tests verify infrastructure boundaries.
4. E2E tests verify complete business flows.
5. Critical business rules must have automated tests.
6. Tests must be deterministic.
7. Tests must not depend on developer-specific environments.
8. Tests should run consistently in local development and CI.
9. Every bug fix should include a regression test when appropriate.
10. Tests are part of the service contract.

---

## 2. Testing Pyramid

The project follows a testing pyramid:

```text
                    ┌───────────┐
                    │    E2E    │
                    │   Tests   │
                    └─────▲─────┘
                          │
                 ┌────────┴────────┐
                 │   Integration   │
                 │      Tests      │
                 └────────▲────────┘
                          │
                 ┌────────┴────────┐
                 │      Unit       │
                 │      Tests      │
                 └─────────────────┘
```

The majority of tests should be unit tests.

Integration tests should cover important infrastructure boundaries.

E2E tests should focus on critical business workflows.

---

## 3. Testing Layers

### 3.1 Unit Tests

Unit tests verify isolated application behavior.

Typical targets:

- Domain logic
- Application services
- Use cases
- Validators
- Mappers
- Utility functions
- Business rules

Example:

```text
AuthService
    │
    ├── validate credentials
    ├── create session
    └── generate tokens
```

Dependencies should normally be mocked.

---

### 3.2 Integration Tests

Integration tests verify interaction between application components and infrastructure.

Examples:

- PostgreSQL repositories
- Prisma queries
- Redis repositories
- MongoDB repositories
- RabbitMQ publishers
- RabbitMQ consumers
- gRPC clients
- gRPC servers

Integration tests should use isolated test infrastructure.

---

### 3.3 End-to-End Tests

E2E tests verify complete flows through the external API boundary.

Example:

```text
Client
  │
  ▼
API Gateway
  │
  ▼
Auth Service
  │
  ▼
PostgreSQL
  │
  ▼
Response
```

E2E tests should focus on critical user-facing workflows rather than testing every internal implementation detail.

---

## 4. Testing Tools

The project uses:

- Jest
- `@nestjs/testing`
- Supertest
- Prisma
- Docker-based test infrastructure

Additional tools may be introduced when a concrete testing requirement exists.

---

## 5. Test Directory Structure

Tests should be colocated with the code they verify when practical.

Example:

```text
src/
├── auth/
│   ├── auth.service.ts
│   ├── auth.service.spec.ts
│   ├── auth.controller.ts
│   └── auth.controller.spec.ts
│
└── users/
    ├── users.service.ts
    └── users.service.spec.ts
```

Integration and E2E tests may use dedicated directories:

```text
test/
├── integration/
└── e2e/
```

---

## 6. Unit Test Convention

Unit test files use:

```text
*.spec.ts
```

Example:

```text
auth.service.ts
auth.service.spec.ts
```

Tests should follow the Arrange / Act / Assert pattern.

```typescript
it('should reject invalid credentials', async () => {
  // Arrange
  // Act
  // Assert
});
```

---

## 7. Test Naming

Test names should describe observable behavior.

Good:

```typescript
it('should reject invalid credentials');
it('should create a session after successful authentication');
it('should reject an expired refresh token');
```

Avoid:

```typescript
it('test login');
it('works');
it('should call method');
```

The test name should explain what failed when the test fails.

---

## 8. Mocking

External dependencies should be mocked in unit tests.

Typical dependencies:

- Prisma
- Redis
- RabbitMQ
- gRPC clients
- External APIs

Example:

```typescript
const prismaMock = {
  user: {
    findUnique: jest.fn(),
  },
};
```

The purpose is to isolate the unit under test.

---

## 9. What Should Not Be Mocked

Do not mock the behavior being tested.

For example, if testing a repository implementation, mocking Prisma would defeat the purpose of an integration test.

```text
Unit Test
Service
 │
 ├── Mock Repository
 └── Mock Redis

Integration Test
Repository
 │
 └── Real PostgreSQL
```

The testing layer determines whether dependencies are mocked or real.

---

## 10. Database Testing

Database-related tests should distinguish between unit and integration testing.

### Unit

Repository dependency is mocked.

```text
Service
   │
   ▼
Mock Repository
```

### Integration

The actual database is used.

```text
Repository
   │
   ▼
Prisma
   │
   ▼
PostgreSQL
```

Tests must run against isolated test data.

---

## 11. Redis Testing

Redis-dependent logic should be tested at two levels.

### Unit

Redis client is mocked.

### Integration

Tests communicate with a real Redis instance.

Example:

```text
Application
    │
    ▼
Redis Client
    │
    ▼
Test Redis
```

Tests must clean up keys after execution.

---

## 12. Messaging Testing

RabbitMQ interactions require both producer and consumer testing.

### Producer

Verify that the correct event is published.

```text
Application
    │
    ▼
Event Publisher
    │
    ▼
RabbitMQ
```

### Consumer

Verify that the consumer correctly processes an event.

```text
RabbitMQ
    │
    ▼
Consumer
    │
    ▼
Application Logic
```

Consumer tests must also verify idempotency where applicable.

---

## 13. gRPC Testing

Internal service communication uses gRPC.

Testing should verify:

- Request contract
- Response contract
- Error handling
- Validation
- Timeout behavior
- Service availability behavior

Example:

```text
Service A
   │
   │ gRPC
   ▼
Service B
```

The gRPC contract should be treated as an API contract between services.

---

## 14. Event-Driven Testing

Event-driven workflows require testing both:

1. Event publication
2. Event consumption

Example:

```text
Telemetry Service
      │
      │ TelemetryReceived
      ▼
   RabbitMQ
      │
      ▼
Alert Service
```

Tests should verify:

- Correct event type
- Required event payload
- Consumer behavior
- Error handling
- Retry behavior
- Idempotent processing

---

## 15. Contract Testing

Internal service contracts should be verified independently of business logic.

Contracts include:

- REST API
- gRPC
- Events

The purpose is to prevent one service from changing a contract and silently breaking another service.

---

## 16. E2E Testing

E2E tests should focus on critical flows.

Examples:

### Authentication

```text
Login
  │
  ▼
Issue Tokens
  │
  ▼
Create Session
  │
  ▼
Authenticated Request
```

### Machine Monitoring

```text
Machine
  │
  ▼
Telemetry
  │
  ▼
Telemetry Service
  │
  ▼
Alert Service
  │
  ▼
Alert
```

### Incident

```text
Alert
  │
  ▼
Incident
  │
  ▼
Resolution
  │
  ▼
Audit Event
```

---

## 17. Test Isolation

Tests must not depend on execution order.

Bad:

```text
test A creates user
       ↓
test B assumes user exists
```

Good:

```text
test A
  └── creates its own data

test B
  └── creates its own data
```

Each test should establish its own required state.

---

## 18. Test Data

Test data should be deterministic.

Avoid depending on:

- Production data
- Developer-specific databases
- External APIs
- Current time without control
- Random values without deterministic seeds

Use test factories or fixtures where appropriate.

---

## 19. Time-Dependent Tests

Authentication, sessions, TTLs, scheduling, and maintenance logic may depend on time.

Tests should control time when necessary.

Example:

```text
Current Time
     │
     ▼
Fake/Test Clock
     │
     ▼
Application
```

This prevents flaky tests caused by real system time.

---

## 20. Error Testing

Tests must verify expected failures, not only successful paths.

Examples:

- Invalid input
- Unauthorized access
- Forbidden access
- Missing resource
- Duplicate resource
- Database failure
- Redis failure
- Message processing failure
- gRPC timeout

Example:

```typescript
await expect(service.login(invalidCredentials)).rejects.toThrow();
```

---

## 21. Coverage

Coverage is a quality indicator, not the sole definition of test quality.

The project should prioritize coverage of:

- Business rules
- Critical workflows
- Error paths
- Authentication
- Authorization
- Data consistency
- Event processing
- Idempotency

Avoid writing meaningless tests solely to increase coverage percentage.

---

## 22. Running Tests

### All tests for a service

```bash
yarn workspace @fms/auth-service test
```

### Watch mode

```bash
yarn workspace @fms/auth-service test:watch
```

### Coverage

```bash
yarn workspace @fms/auth-service test:coverage
```

### Typecheck

```bash
yarn workspace @fms/auth-service typecheck
```

### Lint

```bash
yarn workspace @fms/auth-service lint
```

---

## 23. CI Quality Gate

A service should not be merged when the required quality checks fail.

Minimum quality gate:

```text
Typecheck
   │
   ▼
Lint
   │
   ▼
Unit Tests
   │
   ▼
Integration Tests
   │
   ▼
Build
```

E2E tests may run as a separate pipeline stage depending on execution cost.

---

## 24. Flaky Tests

Flaky tests must be treated as defects.

A test is considered problematic when it:

- Passes and fails without code changes.
- Depends on execution order.
- Depends on external services.
- Depends on uncontrolled time.
- Depends on uncontrolled random data.

Do not solve flaky tests by simply increasing retry counts.

The underlying cause should be identified and fixed.

---

## 25. Regression Tests

When fixing a reproducible bug:

```text
Bug
 │
 ▼
Reproduce
 │
 ▼
Write Regression Test
 │
 ▼
Fix
 │
 ▼
Run Test
```

This prevents the same defect from silently returning.

---

## 26. Testing Principles

The project follows:

1. Fast tests first.
2. Isolation by default.
3. Deterministic test data.
4. Explicit infrastructure dependencies.
5. Business behavior over implementation details.
6. Critical workflows must be automated.
7. Integration boundaries must be verified.
8. Event consumers must be idempotent.
9. Flaky tests are defects.
10. Coverage supports quality but does not replace engineering judgment.
