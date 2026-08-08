# FMS Database Design & Prisma Schemas

This package contains the database-per-service design and Prisma schemas for the selected FMS microservice architecture.

## Services

1. API Gateway — no database
2. Auth Service
3. Factory Service
4. Telemetry Service
5. Alert Service
6. Maintenance Service
7. Incident Service
8. Reporting Service
9. Audit Service

## Important

There are deliberately **no cross-service Prisma relations**. A UUID such as `machineId` in Maintenance or Telemetry is a reference to the Factory Service resource, not a database foreign key.

This keeps service ownership clean and prevents the microservices from becoming a distributed monolith.

## Suggested repository structure

```text
services/
├── auth-service/
│   └── prisma/schema.prisma
├── factory-service/
│   └── prisma/schema.prisma
├── telemetry-service/
│   └── prisma/schema.prisma
├── alert-service/
│   └── prisma/schema.prisma
├── maintenance-service/
│   └── prisma/schema.prisma
├── incident-service/
│   └── prisma/schema.prisma
├── reporting-service/
│   └── prisma/schema.prisma
└── audit-service/
    └── prisma/schema.prisma
```

## Next implementation sequence

```text
1. Create PostgreSQL databases
2. Configure DATABASE_URL per service
3. Run prisma format
4. Run prisma validate
5. Create initial migrations
6. Seed reference data
7. Implement repositories
8. Implement service-level APIs
9. Add event contracts
10. Add integration tests
```
