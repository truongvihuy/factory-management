# Getting Started

This guide explains how to set up the Factory Management System for local development.

---

## Prerequisites

Make sure the following tools are installed.

### Node.js

The project requires Node.js 22.

```bash
node --version
```

Expected:

```text
v22.x.x
```

### Yarn

Check Yarn:

```bash
yarn --version
```

### Docker

Check Docker:

```bash
docker --version
```

### Docker Compose

Check Docker Compose:

```bash
docker compose version
```

### Git

```bash
git --version
```

---

## 1. Clone Repository

```bash
git clone <repository-url>
cd factory-management
```

---

## 2. Install Dependencies

Install all monorepo dependencies:

```bash
yarn install
```

Verify the workspace:

```bash
yarn workspaces list
```

The Auth Service should be available as:

```text
@fms/auth-service
```

---

## 3. Configure Environment

Create the local environment file:

```bash
cp .env.example .env
```

The `.env` file contains local development configuration.

Never commit `.env` to Git.

The repository only tracks:

```text
.env.example
```

---

## 4. Start Development Infrastructure

Start PostgreSQL and Redis:

```bash
docker compose up -d
```

Check container status:

```bash
docker compose ps
```

All required infrastructure should report a healthy or running state.

---

## 5. Start Auth Service

Start the Auth Service in development mode:

```bash
yarn workspace @fms/auth-service dev
```

The service should start using the configured application port.

For the default configuration:

```text
http://localhost:3001
```

---

## 6. Verify Health

Check the health endpoint:

```http
GET /health
```

Expected response:

```json
{
  "status": "ok"
}
```

If dependency health checks are enabled, the response should also report the status of PostgreSQL and Redis.

---

## 7. Run Typecheck

```bash
yarn workspace @fms/auth-service typecheck
```

The command must complete with exit code `0`.

---

## 8. Run Lint

```bash
yarn workspace @fms/auth-service lint
```

The command must complete without ESLint errors.

---

## 9. Run Tests

```bash
yarn workspace @fms/auth-service test
```

Run tests with coverage:

```bash
yarn workspace @fms/auth-service test:coverage
```

---

## 10. Build

Build the Auth Service:

```bash
yarn workspace @fms/auth-service build
```

The compiled application should be generated under:

```text
apps/auth-service/dist/
```

---

## 11. Run Production Build Locally

After building:

```bash
node apps/auth-service/dist/main.js
```

The application must start successfully using the configured environment.

---

## 12. Stop Development Infrastructure

Stop containers:

```bash
docker compose down
```

This preserves Docker volumes.

To completely reset local development data:

```bash
docker compose down -v
```

> Use `down -v` only when a complete infrastructure reset is required.

---

## Development Workflow

A typical development workflow is:

```text
Clone Repository
      │
      ▼
yarn install
      │
      ▼
Configure .env
      │
      ▼
docker compose up -d
      │
      ▼
Start Service
      │
      ▼
Implement Changes
      │
      ├── Typecheck
      ├── Lint
      ├── Test
      └── Build
      │
      ▼
Commit Changes
      │
      ▼
Pull Request
```

---

## Common Commands

### Install dependencies

```bash
yarn install
```

### Start infrastructure

```bash
docker compose up -d
```

### Stop infrastructure

```bash
docker compose down
```

### Start Auth Service

```bash
yarn workspace @fms/auth-service dev
```

### Typecheck

```bash
yarn workspace @fms/auth-service typecheck
```

### Lint

```bash
yarn workspace @fms/auth-service lint
```

### Test

```bash
yarn workspace @fms/auth-service test
```

### Test coverage

```bash
yarn workspace @fms/auth-service test:coverage
```

### Build

```bash
yarn workspace @fms/auth-service build
```

---

## Troubleshooting

### `command not found: nest`

Verify the Nest CLI:

```bash
yarn workspace @fms/auth-service exec nest --version
```

### `command not found: tsc`

Verify TypeScript:

```bash
yarn workspace @fms/auth-service exec tsc --version
```

### Docker containers are not running

Check:

```bash
docker compose ps
```

View logs:

```bash
docker compose logs
```

For a specific service:

```bash
docker compose logs postgres
```

```bash
docker compose logs redis
```

### Configuration validation fails

Check:

```text
.env
.env.example
```

and make sure all required environment variables are configured correctly.

The application intentionally fails during startup when required configuration is invalid.

---

## Clean Development Reset

If the local environment becomes inconsistent:

```bash
docker compose down -v
rm -rf node_modules
yarn install
docker compose up -d
```

Only remove Docker volumes when you are willing to lose local development database data.
