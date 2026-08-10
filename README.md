# Factory Management System

Factory Management System (FMS) is a multi-tenant platform for monitoring and managing factory assets, machine telemetry, alerts, incidents, maintenance activities, reporting, and audit data.

The system is designed as a modular microservice architecture with clear service boundaries, asynchronous event-driven communication, and independent data ownership.

---

## Overview

The system focuses on the following core capabilities:

- Organization and factory management
- Machine and asset management
- Sensor and telemetry management
- Alert management
- Incident management
- Maintenance management
- Dashboard and monitoring
- Reporting and analytics
- Audit logging
- Authentication and authorization

The initial MVP focuses on factory monitoring, asset management, telemetry, alert, incident, maintenance, reporting, and audit capabilities.

---

## Architecture

The backend follows a microservice architecture.

```text
                         ┌─────────────────┐
                         │   API Gateway   │
                         └────────┬────────┘
                                  │
          ┌───────────────────────┼────────────────────────┐
          │                       │                        │
          ▼                       ▼                        ▼
   ┌──────────────┐       ┌──────────────┐       ┌──────────────┐
   │ Auth Service │       │Factory Service│       │Telemetry     │
   │              │       │              │       │Service       │
   └──────┬───────┘       └──────┬───────┘       └──────┬───────┘
          │                      │                       │
          │                      │                       │
          └──────────────────────┼───────────────────────┘
                                 │
                         ┌───────▼────────┐
                         │    RabbitMQ    │
                         │ Event Bus       │
                         └───────┬────────┘
                                 │
             ┌───────────────────┼───────────────────┐
             │                   │                   │
             ▼                   ▼                   ▼
      ┌────────────┐      ┌─────────────┐     ┌────────────┐
      │   Alert    │      │ Maintenance │     │  Incident  │
      │   Service  │      │   Service   │     │  Service   │
      └────────────┘      └─────────────┘     └────────────┘
             │                   │                   │
             └───────────────────┼───────────────────┘
                                 │
                     ┌───────────┴───────────┐
                     ▼                       ▼
              ┌─────────────┐        ┌─────────────┐
              │  Reporting  │        │    Audit    │
              │   Service   │        │   Service   │
              └─────────────┘        └─────────────┘
```

### Services

| Service             | Responsibility                                      |
| ------------------- | --------------------------------------------------- |
| API Gateway         | External API entry point                            |
| Auth Service        | Authentication, users, roles, permissions, sessions |
| Factory Service     | Organizations, factories, machines, assets          |
| Telemetry Service   | Sensor telemetry ingestion and storage              |
| Alert Service       | Alert rules and alert lifecycle                     |
| Maintenance Service | Maintenance schedules and work management           |
| Incident Service    | Incident lifecycle and resolution                   |
| Reporting Service   | Reporting and analytics                             |
| Audit Service       | Audit event storage and querying                    |

---

## Technology Stack

### Runtime

- Node.js 22
- TypeScript
- Yarn

### Backend

- NestJS
- REST API
- gRPC
- Event-Driven Architecture

### Databases

- PostgreSQL
- MongoDB
- Redis

### Data Access

- Prisma

### Messaging

- RabbitMQ

### Infrastructure

- Docker
- Docker Compose
- Kubernetes

### Observability

- OpenTelemetry
- Prometheus
- Grafana
- Jaeger / Tempo

### Testing

- Jest
- NestJS Testing
- Supertest

---

## Project Structure

```text
factory-management/
├── apps/
│   ├── api-gateway/
│   ├── auth-service/
│   ├── factory-service/
│   ├── telemetry-service/
│   ├── alert-service/
│   ├── maintenance-service/
│   ├── incident-service/
│   ├── reporting-service/
│   └── audit-service/
│
├── packages/
│   └── ...
│
├── config/
│   └── ...
│
├── docker/
│   └── ...
│
├── docs/
│   └── ...
│
├── scripts/
│   └── ...
│
├── docker-compose.yml
├── package.json
├── tsconfig.json
├── .gitignore
├── .gitattributes
└── README.md
```

---

## Requirements

Before starting development, make sure the following are installed:

- Node.js 22
- Yarn
- Docker
- Docker Compose
- Git

Check the installed versions:

```bash
node --version
yarn --version
docker --version
docker compose version
git --version
```

---

## Getting Started

See [Getting Started](#getting-started) below for the complete local development setup.

### 1. Clone the repository

```bash
git clone <repository-url>
cd factory-management
```

### 2. Install dependencies

```bash
yarn install
```

### 3. Configure environment

Copy the example environment file:

```bash
cp .env.example .env
```

Review the environment variables before starting the services.

### 4. Start development infrastructure

```bash
docker compose up -d
```

Check the infrastructure:

```bash
docker compose ps
```

### 5. Start Auth Service

```bash
yarn workspace @fms/auth-service dev
```

The service should start on the configured application port.

---

## Development Commands

### Typecheck

```bash
yarn workspace @fms/auth-service typecheck
```

### Lint

```bash
yarn workspace @fms/auth-service lint
```

### Unit Tests

```bash
yarn workspace @fms/auth-service test
```

### Test Coverage

```bash
yarn workspace @fms/auth-service test:coverage
```

### Build

```bash
yarn workspace @fms/auth-service build
```

---

## Docker Development Environment

Development infrastructure is provided through Docker Compose.

Current infrastructure includes:

- PostgreSQL
- Redis

Start:

```bash
docker compose up -d
```

Stop:

```bash
docker compose down
```

Stop and remove development volumes:

```bash
docker compose down -v
```

> `docker compose down -v` removes persistent development data. Use it only when a complete database reset is required.

---

## Environment Configuration

Application configuration is managed through NestJS `ConfigModule`.

Environment variables are:

```text
.env
  │
  ▼
Joi Validation
  │
  ▼
Configuration Mapping
  │
  ▼
ConfigService
  │
  ▼
Application
```

Application code must not access environment variables directly.

Do:

```typescript
configService.getOrThrow('database.url');
```

Do not:

```typescript
process.env.DATABASE_URL;
```

See [Environment Configuration](./docs/environment.md) for details.

---

## Testing

The project follows a testing pyramid:

```text
              E2E
               ▲
               │
        Integration
               ▲
               │
             Unit
```

Testing tools include:

- Jest
- `@nestjs/testing`
- Supertest

See [Testing](./docs/testing.md).

---

## Git Workflow

The project uses:

- Feature branches
- Conventional Commits
- Atomic commits
- Pull Requests
- Code Review

Example:

```bash
git checkout -b feature/auth-login

git add .

git commit -m "feat(auth): add login endpoint"

git push -u origin feature/auth-login
```

See [Git Workflow](./docs/git-workflow.md).

---

## Engineering Principles

The project follows these core engineering principles:

1. Domain-driven service boundaries
2. Database-per-service
3. Contract-first communication
4. REST for external communication
5. gRPC for internal synchronous communication
6. Event-driven asynchronous workflows
7. Idempotent consumers
8. Transactional Outbox
9. Strong typing and validation
10. Observability by default
11. Testability by design

See [Coding Standards](./docs/coding-standards.md).

---

## Documentation

Project documentation is organized under `docs/`.

### Architecture

- [Architecture Overview](./docs/architecture/overview.md)
- [Service Boundaries](./docs/architecture/service-boundaries.md)
- [Communication](./docs/architecture/communication.md)

### Development

- [Environment Configuration](./docs/environment.md)
- [Testing](./docs/testing.md)
- [Git Workflow](./docs/git-workflow.md)
- [Coding Standards](./docs/coding-standards.md)

---

## Development Status

The project is currently in the foundation phase.

The current focus is establishing:

- Repository structure
- Development environment
- TypeScript configuration
- NestJS service foundation
- Code quality
- Environment configuration
- Docker development infrastructure
- Git standards
- Testing foundation
- Documentation
- Foundation verification

Business features will be implemented after the foundation passes the verification gate.

---

## License

This project is currently for development and technical implementation purposes.
