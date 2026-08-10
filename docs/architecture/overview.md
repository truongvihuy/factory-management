# Architecture Overview

## 1. Purpose

This document provides a high-level overview of the architecture of the Factory Management System (FMS).

It describes the major architectural components, service topology, infrastructure, data ownership, and system-level design principles.

Detailed service ownership and communication rules are documented separately:

- [Service Boundaries](./service-boundaries.md)
- [Communication](./communication.md)

---

# 2. Architecture Style

The Factory Management System follows a **Microservice Architecture**.

The system is designed around independently deployable services, where each service owns a specific business capability and its associated data.

The architecture follows these principles:

- Domain-oriented service boundaries
- Database-per-service
- API Gateway
- REST for external APIs
- gRPC for synchronous internal communication
- Event-driven asynchronous communication
- RabbitMQ for messaging
- Redis for caching and session management
- Strong typing and validation
- Observability by default
- Horizontal scalability
- Independent service deployment

---

# 3. High-Level Architecture

```text
                         ┌─────────────────────┐
                         │      Clients        │
                         │ Web / Mobile / API  │
                         └──────────┬──────────┘
                                    │
                                    │ REST / HTTPS
                                    ▼
                         ┌─────────────────────┐
                         │    API Gateway      │
                         └──────────┬──────────┘
                                    │
                 ┌──────────────────┼──────────────────┐
                 │                  │                  │
                 ▼                  ▼                  ▼
          ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
          │ Auth        │    │ Factory     │    │ Telemetry   │
          │ Service     │    │ Service     │    │ Service     │
          └──────┬──────┘    └──────┬──────┘    └──────┬──────┘
                 │                  │                  │
                 ▼                  ▼                  ▼
          ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
          │ Auth DB     │    │ Factory DB  │    │ Telemetry DB│
          └─────────────┘    └─────────────┘    └─────────────┘


                 ┌─────────────────────────────────────┐
                 │            RabbitMQ                 │
                 │        Event / Messaging Bus        │
                 └──────────────────┬──────────────────┘
                                    │
             ┌──────────────────────┼──────────────────────┐
             │                      │                      │
             ▼                      ▼                      ▼
      ┌─────────────┐       ┌─────────────┐       ┌─────────────┐
      │ Alert       │       │ Maintenance │       │ Incident    │
      │ Service     │       │ Service     │       │ Service     │
      └──────┬──────┘       └──────┬──────┘       └──────┬──────┘
             │                     │                     │
             ▼                     ▼                     ▼
        Alert DB             Maintenance DB         Incident DB


             ┌──────────────────────┬──────────────────────┐
             │                      │
             ▼                      ▼
      ┌─────────────┐       ┌─────────────┐
      │ Reporting   │       │ Audit       │
      │ Service     │       │ Service     │
      └──────┬──────┘       └──────┬──────┘
             │                     │
             ▼                     ▼
       Reporting DB             Audit DB
```

---

# 4. Core Services

The current architecture contains the following services.

| Service             | Primary Responsibility                         |
| ------------------- | ---------------------------------------------- |
| API Gateway         | External API entry point and request routing   |
| Auth Service        | Authentication, authorization, users, sessions |
| Factory Service     | Organization and asset management              |
| Telemetry Service   | Machine and sensor telemetry                   |
| Alert Service       | Alert detection and alert lifecycle            |
| Maintenance Service | Maintenance planning and execution             |
| Incident Service    | Incident management and resolution             |
| Reporting Service   | Reporting and analytical data                  |
| Audit Service       | Audit log management                           |

Service ownership is defined in detail in:

[Service Boundaries](./service-boundaries.md)

---

# 5. API Gateway

The API Gateway is the primary entry point for external clients.

```text
Client
  │
  │ HTTPS / REST
  ▼
API Gateway
  │
  ├── Auth Service
  ├── Factory Service
  ├── Telemetry Service
  ├── Alert Service
  ├── Maintenance Service
  ├── Incident Service
  ├── Reporting Service
  └── Audit Service
```

The gateway is responsible for concerns such as:

- Request routing
- Authentication integration
- Authorization integration
- Request validation at the external boundary
- Rate limiting
- Request correlation
- API-level observability
- Response mapping

The API Gateway should not contain business logic belonging to individual services.

---

# 6. Service Architecture

Each business service is independently deployable.

A typical service follows a layered architecture:

```text
Service
│
├── Transport
│   ├── REST
│   └── gRPC
│
├── Application
│   ├── Use Cases
│   └── Application Services
│
├── Domain
│   ├── Entities
│   ├── Value Objects
│   └── Business Rules
│
├── Infrastructure
│   ├── Prisma
│   ├── Repositories
│   ├── Redis
│   └── Messaging
│
└── Common
    ├── Logging
    ├── Errors
    └── Observability
```

The exact internal structure may differ between services depending on their domain complexity.

---

# 7. Database Architecture

The system follows the **Database-per-Service** principle.

```text
Auth Service
     │
     ▼
 Auth DB

Factory Service
     │
     ▼
Factory DB

Telemetry Service
     │
     ▼
Telemetry DB

Alert Service
     │
     ▼
Alert DB
```

Each service owns its persistence model.

A service must not directly access another service's database.

Communication between services must occur through defined APIs or events.

---

# 8. Polyglot Persistence

The system may use different persistence technologies according to workload requirements.

Primary technologies include:

```text
PostgreSQL
MongoDB
Redis
```

### PostgreSQL

Used for transactional relational data requiring:

- Strong consistency
- Referential integrity
- Transactions
- Structured relationships
- Complex queries

Typical examples:

- Users
- Organizations
- Machines
- Maintenance records
- Incidents
- Audit metadata

### MongoDB

Used where flexible or high-volume document-oriented storage provides advantages.

A major candidate is telemetry data, depending on the final telemetry storage and performance requirements.

### Redis

Used for fast ephemeral or frequently accessed data.

Examples:

- Authentication sessions
- Cache
- Distributed locks
- Short-lived state
- Rate limiting

Redis is not considered the system's source of truth for persistent business data unless explicitly designed for a specific use case.

---

# 9. Communication Architecture

The system uses two primary communication patterns.

## Synchronous Communication

Used when the caller requires an immediate response.

```text
Service A
    │
    │ gRPC
    ▼
Service B
```

Typical use cases:

- Querying another service
- Immediate validation
- Request/response workflows
- Operations requiring an immediate result

---

## Asynchronous Communication

Used when immediate response is unnecessary or when services should be decoupled.

```text
Service A
    │
    │ Event
    ▼
 RabbitMQ
    │
    ▼
Service B
```

Typical use cases:

- Domain events
- Background processing
- Audit logging
- Notifications
- Alert processing
- Long-running workflows

Detailed communication rules are documented in:

[Communication](./communication.md)

---

# 10. Event-Driven Architecture

RabbitMQ is used as the messaging infrastructure for asynchronous communication.

Example:

```text
Telemetry Service
       │
       │ TelemetryReceived
       ▼
    RabbitMQ
       │
       ├──────────────► Alert Service
       │
       ├──────────────► Reporting Service
       │
       └──────────────► Audit Service
```

This allows consumers to process events independently.

Event consumers must be designed to handle:

- Duplicate delivery
- Retry
- Failure
- Out-of-order processing where applicable
- Idempotency

---

# 11. Transactional Outbox

Services use the Transactional Outbox pattern where a database state change must reliably result in an event.

```text
                 Database Transaction
                ┌────────────────────┐
                │                    │
                │ Business Data      │
                │                    │
                │ Outbox Event       │
                │                    │
                └─────────┬──────────┘
                          │
                       Commit
                          │
                          ▼
                   Outbox Publisher
                          │
                          ▼
                      RabbitMQ
```

This prevents the common failure scenario where:

```text
Database Commit
      │
      ▼
Publish Event
      │
      X
   Failure
```

leaves the database updated while the event is lost.

---

# 12. Authentication and Session Architecture

Authentication is centralized in the Auth Service.

```text
Client
   │
   ▼
API Gateway
   │
   ▼
Auth Service
   │
   ├── Users
   ├── Credentials
   ├── Roles / Permissions
   └── Sessions
```

Session state is stored in Redis for fast access and horizontal scalability.

Persistent identity and authentication-related data remains in the Auth Service database.

---

# 13. Observability Architecture

Observability is built into the architecture rather than added later.

The system uses:

```text
OpenTelemetry
      │
      ├── Traces
      ├── Metrics
      └── Logs / Context
```

The observability stack includes:

```text
OpenTelemetry
      │
      ├──────────────► Prometheus
      │
      ├──────────────► Grafana
      │
      └──────────────► Jaeger / Tempo
```

The exact production topology may evolve as deployment infrastructure is finalized.

---

# 14. Logging and Correlation

Every request and asynchronous operation should be traceable across service boundaries.

Example:

```text
Client Request
     │
     ▼
API Gateway
     │
     │ traceId / correlationId
     ▼
Auth Service
     │
     │ correlationId
     ▼
RabbitMQ
     │
     ▼
Audit Service
```

This enables engineers to follow a business operation across multiple services.

---

# 15. Scalability

The architecture is designed for horizontal scaling.

Services should be stateless where practical.

Example:

```text
                API Gateway
                     │
          ┌──────────┼──────────┐
          ▼          ▼          ▼
       Auth-1     Auth-2     Auth-3
          │          │          │
          └──────────┼──────────┘
                     │
                  Redis
```

Multiple instances of the same service can process requests concurrently.

State that must be shared between instances should be stored in external infrastructure such as:

- PostgreSQL
- MongoDB
- Redis
- RabbitMQ

rather than local process memory.

---

# 16. Reliability Principles

The architecture follows these reliability principles:

- Health checks
- Liveness and readiness probes
- Graceful shutdown
- Timeouts
- Retry with controlled backoff
- Idempotent consumers
- Transactional Outbox
- Dead-letter handling
- Circuit breaking where appropriate
- Observability
- Failure isolation

Reliability mechanisms should be applied according to the communication pattern and failure characteristics rather than indiscriminately.

---

# 17. Security Principles

Security is enforced at multiple layers.

```text
Client
  │
  ▼
API Gateway
  │
  ├── Authentication
  ├── Authorization
  ├── Rate Limiting
  └── Input Validation
       │
       ▼
Service
  │
  ├── Authorization checks
  ├── Input validation
  └── Business rules
```

Sensitive information must not be exposed through:

- Logs
- Error messages
- Events
- API responses
- Metrics

Secrets must be managed through environment configuration or an appropriate secret-management system.

---

# 18. Deployment Architecture

The services are designed to run as independently deployable containers.

The target orchestration platform is Kubernetes.

```text
                    Kubernetes Cluster
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼
   API Gateway         Auth Service       Factory Service
        │                  │                  │
        ▼                  ▼                  ▼
   Deployment         Deployment        Deployment
```

Supporting infrastructure includes:

```text
PostgreSQL
MongoDB
Redis
RabbitMQ
Prometheus
Grafana
Jaeger / Tempo
```

Each component may be deployed and scaled independently according to workload requirements.

---

# 19. Architectural Principles

The system follows these core engineering principles:

1. **Domain-driven service boundaries**
2. **Database-per-service**
3. **Contract-first communication**
4. **REST for external APIs**
5. **gRPC for synchronous internal communication**
6. **Event-driven asynchronous workflows**
7. **Idempotent consumers**
8. **Transactional Outbox**
9. **Strong typing and validation**
10. **Observability by default**
11. **Testability by design**
12. **Horizontal scalability**

These principles form the architectural baseline for the MVP implementation.

---

# 20. Architecture Documentation

This document provides the high-level architecture only.

For detailed architecture decisions, refer to:

### Service Boundaries

[Service Boundaries](./service-boundaries.md)

Defines:

- Service responsibilities
- Domain ownership
- Data ownership
- Service dependencies
- Published events
- Consumed events
- Explicit boundaries

### Communication

[Communication](./communication.md)

Defines:

- REST communication
- gRPC communication
- RabbitMQ messaging
- Event contracts
- Retry behavior
- Timeout policies
- Idempotency
- Communication rules

---

# 21. Architecture Evolution

The architecture is expected to evolve as the system moves from MVP toward larger production workloads.

Architectural changes should be:

1. Identified
2. Evaluated
3. Documented
4. Reviewed
5. Implemented
6. Reflected in architecture documentation

The architecture should evolve based on measurable requirements such as:

- Traffic
- Latency
- Throughput
- Data volume
- Reliability requirements
- Operational complexity
- Cost

Architecture should solve demonstrated problems rather than hypothetical ones.

---

# 22. Summary

The Factory Management System uses a microservice architecture designed around clear business boundaries and independent data ownership.

The core architecture is:

```text
                     Clients
                        │
                        ▼
                 API Gateway
                        │
        ┌───────────────┼────────────────┐
        │               │                │
        ▼               ▼                ▼
   Auth Service   Factory Service   Telemetry Service
        │               │                │
        ▼               ▼                ▼
      Auth DB       Factory DB      Telemetry DB
        │               │                │
        └───────────────┼────────────────┘
                        │
                        ▼
                    RabbitMQ
                        │
        ┌───────────────┼────────────────────┐
        │               │                    │
        ▼               ▼                    ▼
      Alert        Maintenance           Incident
     Service         Service              Service
        │               │                    │
        ▼               ▼                    ▼
     Alert DB      Maintenance DB       Incident DB
        │               │                    │
        └───────────────┼────────────────────┘
                        │
                 ┌──────┴──────┐
                 ▼             ▼
            Reporting        Audit
             Service         Service
                 │             │
                 ▼             ▼
            Reporting DB     Audit DB
```

The architecture prioritizes:

**clear ownership → loose coupling → independent scaling → reliable communication → observability → maintainability.**
