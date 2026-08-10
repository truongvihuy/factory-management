# Service Boundaries

## 1. Purpose

This document defines the boundaries, responsibilities, ownership, and dependencies of each service in the Factory Management System (FMS).

The primary objective is to ensure that each microservice has a clear business responsibility and owns its data independently.

These boundaries are architectural rules, not merely organizational guidelines.

A service must not directly access or modify another service's database.

---

# 2. Service Architecture

The FMS currently consists of the following services:

```text
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

Each service owns:

- Its business domain
- Its application logic
- Its database
- Its persistence model
- Its service-level APIs
- Its domain events

---

# 3. Boundary Principles

The architecture follows these rules.

## 3.1 Single Domain Ownership

Each business concept must have one authoritative owner.

Example:

```text
Machine
   │
   ▼
Factory Service
```

Other services may reference a machine but must not become the owner of machine lifecycle management.

---

## 3.2 Database Ownership

Each service owns its database.

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
```

A service must never directly query another service's database.

Forbidden:

```text
Alert Service
      │
      ▼
Factory DB
```

Required:

```text
Alert Service
      │
      ├── gRPC
      └── Events
            │
            ▼
      Factory Service
```

---

## 3.3 Business Rule Ownership

A service owns the business rules related to its domain.

Other services must not duplicate those rules unless they are explicitly part of their own domain.

---

## 3.4 Communication Through Contracts

Services communicate through explicit contracts:

```text
REST
gRPC
RabbitMQ Events
```

Internal implementation details must not become cross-service dependencies.

---

# 4. API Gateway

## Responsibility

The API Gateway is the external entry point of the system.

It is responsible for:

- Routing external requests
- API composition where appropriate
- Authentication integration
- Authorization integration
- Rate limiting
- Request correlation
- External API validation
- API-level observability
- Response mapping

---

## Owns

The API Gateway owns:

```text
API routing configuration
Gateway policies
External API contract
```

It does **not** own business data.

---

## Does Not Own

The API Gateway must not own:

- Users
- Organizations
- Machines
- Sensors
- Telemetry
- Alerts
- Maintenance records
- Incidents
- Reports
- Audit records

---

## Database

```text
No business database
```

The gateway should remain as stateless as practical.

---

# 5. Auth Service

## Responsibility

The Auth Service owns identity and authentication-related capabilities.

Primary responsibilities:

- User identity
- Credentials
- Authentication
- Authorization
- Roles
- Permissions
- Session management
- Authentication lifecycle

---

## Owns

```text
User
Credential
Role
Permission
RolePermission
UserRole
Session-related persistence metadata
```

Runtime session state is stored in Redis where applicable.

---

## Does Not Own

Auth Service does not own:

- Organization operational data
- Factories
- Production lines
- Machines
- Sensors
- Telemetry
- Alerts
- Maintenance
- Incidents
- Reports
- Audit records

---

## Database

```text
Auth Service
      │
      ▼
PostgreSQL
```

Redis is used for:

- Session state
- Short-lived authentication state
- Cache where appropriate

---

## Communication

Auth Service may communicate through:

```text
gRPC
RabbitMQ
```

Authentication-related events may be published for other services.

Examples:

```text
user.created
user.updated
user.disabled
role.updated
```

---

# 6. Factory Service

## Responsibility

Factory Service owns organization and asset management.

It is the authoritative owner of the physical and organizational structure of the factory environment.

---

## Domain

```text
Organization
    │
    └── Factory
          │
          └── Production Line
                 │
                 └── Machine
                       │
                       └── Sensor
```

---

## Owns

```text
Organization
Factory
ProductionLine
Machine
Sensor
Asset metadata
Asset lifecycle
```

---

## Business Responsibilities

Factory Service manages:

- Organization lifecycle
- Factory lifecycle
- Production line lifecycle
- Machine registration
- Machine configuration metadata
- Sensor registration
- Asset status
- Asset relationships

---

## Does Not Own

Factory Service does not own:

- Telemetry history
- Alert lifecycle
- Maintenance execution
- Incident lifecycle
- Reports
- Audit logs
- Authentication sessions

---

## Database

```text
Factory Service
      │
      ▼
PostgreSQL
```

---

## Communication

Other services may request asset information through:

```text
gRPC
```

Asset-related changes may be propagated through:

```text
RabbitMQ
```

Examples:

```text
machine.registered
machine.updated
machine.disabled
sensor.registered
```

---

# 7. Telemetry Service

## Responsibility

Telemetry Service owns machine and sensor telemetry ingestion and storage.

It is responsible for handling high-volume telemetry data generated by machines and sensors.

---

## Owns

```text
Telemetry
Telemetry measurements
Telemetry metadata
Telemetry ingestion state
Telemetry aggregation data
```

Example measurements:

```text
temperature
vibration
machine status
throughput
energy consumption
```

---

## Does Not Own

Telemetry Service does not own:

- Machine registration
- Factory structure
- Sensor lifecycle
- Alert lifecycle
- Maintenance records
- Incident lifecycle

Machine and sensor identity remain owned by Factory Service.

---

## Database

Telemetry may use MongoDB or another workload-appropriate storage technology.

```text
Telemetry Service
       │
       ▼
MongoDB
```

The final storage strategy may evolve based on measured telemetry volume and query requirements.

---

## Communication

Telemetry ingestion may produce events such as:

```text
telemetry.received
telemetry.threshold.detected
```

Consumers may include:

```text
Alert Service
Reporting Service
Audit Service
```

---

# 8. Alert Service

## Responsibility

Alert Service owns the alert lifecycle.

It evaluates telemetry and other relevant events to determine whether an alert should be created or updated.

---

## Owns

```text
Alert
Alert Rule
Alert State
Alert Severity
Alert Lifecycle
```

Example lifecycle:

```text
Detected
   ↓
Open
   ↓
Acknowledged
   ↓
Resolved
```

---

## Does Not Own

Alert Service does not own:

- Machine registration
- Raw telemetry
- Maintenance records
- Incident records
- User identity

---

## Database

```text
Alert Service
      │
      ▼
PostgreSQL
```

---

## Communication

Alert Service consumes events such as:

```text
telemetry.received
machine.updated
```

It may publish:

```text
alert.created
alert.updated
alert.acknowledged
alert.resolved
```

---

# 9. Maintenance Service

## Responsibility

Maintenance Service owns maintenance planning and maintenance execution.

---

## Owns

```text
Maintenance Plan
Maintenance Schedule
Maintenance Task
Maintenance Work
Maintenance Status
Maintenance History
```

Example lifecycle:

```text
Planned
   ↓
Scheduled
   ↓
In Progress
   ↓
Completed
```

---

## Does Not Own

Maintenance Service does not own:

- Machine registration
- Raw telemetry
- Alert lifecycle
- Incident lifecycle
- User authentication

It may reference machines owned by Factory Service.

---

## Database

```text
Maintenance Service
        │
        ▼
PostgreSQL
```

---

## Communication

Maintenance Service may consume:

```text
machine.registered
machine.updated
alert.created
```

It may publish:

```text
maintenance.created
maintenance.scheduled
maintenance.started
maintenance.completed
```

---

# 10. Incident Service

## Responsibility

Incident Service owns operational incident management.

---

## Owns

```text
Incident
Incident Status
Incident Severity
Incident Assignment
Incident Resolution
Incident History
```

Example lifecycle:

```text
Detected
   ↓
Open
   ↓
Investigating
   ↓
Resolved
   ↓
Closed
```

---

## Does Not Own

Incident Service does not own:

- Raw telemetry
- Machines
- Alerts
- Maintenance plans
- User credentials

---

## Database

```text
Incident Service
       │
       ▼
PostgreSQL
```

---

## Communication

Incident Service may consume:

```text
alert.created
machine.updated
maintenance.completed
```

It may publish:

```text
incident.created
incident.updated
incident.resolved
incident.closed
```

---

# 11. Reporting Service

## Responsibility

Reporting Service provides reporting and analytical views of system data.

It is optimized for read-heavy workloads.

---

## Owns

```text
Report Definitions
Reporting Views
Aggregated Metrics
Reporting-specific Read Models
```

Reporting data should be considered a derived representation rather than the authoritative source of business data.

---

## Does Not Own

Reporting Service does not become the owner of:

- Users
- Machines
- Telemetry source data
- Alerts
- Maintenance records
- Incidents

---

## Database

Reporting may maintain its own optimized read database.

```text
Multiple Services
      │
      │ Events
      ▼
Reporting Service
      │
      ▼
Reporting DB
```

---

## Communication

Reporting Service primarily consumes events.

Examples:

```text
machine.registered
telemetry.received
alert.created
maintenance.completed
incident.resolved
```

This reduces the need for synchronous calls for analytical workloads.

---

# 12. Audit Service

## Responsibility

Audit Service owns the audit trail of important system actions.

---

## Owns

```text
Audit Event
Audit Record
Actor
Action
Resource
Timestamp
Correlation ID
Metadata
```

Example:

```text
User updated machine
User acknowledged alert
Maintenance completed
Incident resolved
```

---

## Does Not Own

Audit Service does not own the business entity being audited.

For example:

```text
Factory Service
    └── Machine

Audit Service
    └── Audit record describing machine change
```

Audit Service records the fact that something happened.

It does not become the owner of the machine.

---

## Database

```text
Audit Service
      │
      ▼
PostgreSQL
```

Depending on audit volume, storage strategy may evolve.

---

## Communication

Audit Service primarily consumes events.

```text
Service
   │
   ▼
RabbitMQ
   │
   ▼
Audit Service
```

---

# 13. Domain Ownership Matrix

| Domain           | Owner        |
| ---------------- | ------------ |
| User             | Auth         |
| Credential       | Auth         |
| Role             | Auth         |
| Permission       | Auth         |
| Session          | Auth / Redis |
| Organization     | Factory      |
| Factory          | Factory      |
| Production Line  | Factory      |
| Machine          | Factory      |
| Sensor           | Factory      |
| Telemetry        | Telemetry    |
| Alert Rule       | Alert        |
| Alert            | Alert        |
| Maintenance Plan | Maintenance  |
| Maintenance Task | Maintenance  |
| Incident         | Incident     |
| Report           | Reporting    |
| Audit Record     | Audit        |

This matrix represents the authoritative ownership of each domain concept.

---

# 14. Data Ownership Rules

## Rule 1 — One Owner

Every business entity has one authoritative owner.

---

## Rule 2 — No Cross-Database Access

Forbidden:

```text
Service A
   │
   ▼
Service B Database
```

---

## Rule 3 — Reference, Don't Duplicate Ownership

A service may store an external identifier.

Example:

```text
Maintenance Service

machineId
```

This does not mean Maintenance Service owns the Machine.

Machine ownership remains:

```text
Factory Service
```

---

## Rule 4 — Local Data for Local Decisions

A service should maintain the data required to execute its own business rules.

Do not make every decision dependent on synchronous calls to multiple services.

---

# 15. Cross-Service References

Cross-service relationships should use identifiers rather than database foreign keys.

Example:

```text
Maintenance DB

maintenance
├── id
├── machineId
└── ...
```

`machineId` references an entity owned by Factory Service.

There must not be a PostgreSQL foreign key from Maintenance DB to Factory DB.

---

# 16. Service Dependencies

High-level dependencies:

```text
API Gateway
    │
    ├── Auth
    ├── Factory
    ├── Telemetry
    ├── Alert
    ├── Maintenance
    ├── Incident
    ├── Reporting
    └── Audit


Telemetry
    │
    └── Factory (asset identity)


Alert
    ├── Telemetry
    └── Factory


Maintenance
    ├── Factory
    └── Alert


Incident
    ├── Alert
    ├── Factory
    └── Maintenance


Reporting
    └── Domain Events


Audit
    └── Domain Events
```

These dependencies should be minimized and reviewed as the system evolves.

---

# 17. Synchronous Dependency Rules

Use gRPC when an immediate response is required.

Example:

```text
Maintenance Service
       │
       │ gRPC
       ▼
Factory Service
       │
       ▼
"Does machine X exist?"
```

Avoid synchronous chains such as:

```text
A → B → C → D → E
```

Long synchronous chains increase latency and failure propagation.

---

# 18. Asynchronous Dependency Rules

Use RabbitMQ when the operation can be decoupled.

Example:

```text
Telemetry Service
       │
       ▼
telemetry.received
       │
       ▼
RabbitMQ
       │
       ├──► Alert Service
       ├──► Reporting Service
       └──► Audit Service
```

Consumers process events independently.

---

# 19. Service Independence

A service should be deployable independently.

Ideally:

```text
Deploy Auth
```

should not require:

```text
Deploy Factory
Deploy Telemetry
Deploy Alert
...
```

unless a shared contract change requires coordinated deployment.

---

# 20. Failure Isolation

Failure in one service should not unnecessarily bring down unrelated services.

Example:

```text
Reporting Service DOWN
       │
       X
       │
       ▼
Core Operations
       │
       ├── Auth
       ├── Factory
       ├── Telemetry
       ├── Alert
       ├── Maintenance
       └── Incident
```

Reporting should recover from missed events or consume them from durable messaging infrastructure where applicable.

---

# 21. Scaling Boundaries

Each service can be scaled independently.

Example:

```text
Telemetry Service
      │
      ├── Instance 1
      ├── Instance 2
      ├── Instance 3
      └── Instance 4
```

Telemetry may require significantly more instances than:

```text
Audit Service
```

because workloads are different.

This independent scalability is one of the primary reasons for maintaining service boundaries.

---

# 22. Boundary Violation Examples

The following are considered architectural violations.

### Violation 1 — Direct Database Access

```text
Alert Service
      │
      ▼
Factory DB
```

---

### Violation 2 — Business Logic Duplication

Factory Service:

```text
Machine lifecycle rules
```

Alert Service independently implements:

```text
Machine lifecycle rules
```

without a valid domain reason.

---

### Violation 3 — Shared Database

```text
Auth Service ─────┐
Factory Service ──┼──► Shared DB
Alert Service ────┘
```

This creates strong coupling and prevents independent evolution.

---

### Violation 4 — Distributed Business Transaction

Avoid transactions that require:

```text
Service A
   ↓
Service B
   ↓
Service C
```

to commit atomically.

Use events, Saga-like workflows, compensating actions, or eventual consistency where appropriate.

---

# 23. Architecture Decision Rule

When deciding whether functionality belongs in an existing service or a new service, evaluate:

1. Does it represent a distinct business capability?
2. Does it have its own lifecycle?
3. Does it have independent scaling requirements?
4. Does it have independent data ownership?
5. Does it require independent deployment?
6. Does separating it reduce coupling?
7. Is the operational complexity justified?

A new service should not be created merely because a feature can technically be separated.

---

# 24. Boundary Evolution

Service boundaries are not immutable.

However, changing a boundary requires an explicit architectural decision.

Process:

```text
Identify Problem
      ↓
Analyze Current Boundary
      ↓
Evaluate Alternatives
      ↓
Document Decision
      ↓
Update Service Boundary
      ↓
Update Communication Contracts
      ↓
Update Documentation
```

Architectural changes must not be introduced accidentally through implementation.

---

# 25. Final Ownership Model

The current ownership model is:

```text
                         API Gateway
                              │
        ┌─────────────────────┼──────────────────────┐
        │                     │                      │
        ▼                     ▼                      ▼
      Auth                 Factory               Telemetry
        │                     │                      │
        ▼                     ▼                      ▼
     Auth DB              Factory DB           Telemetry DB


                        RabbitMQ
                           │
          ┌────────────────┼─────────────────┐
          │                │                 │
          ▼                ▼                 ▼
        Alert         Maintenance        Incident
          │                │                 │
          ▼                ▼                 ▼
       Alert DB      Maintenance DB      Incident DB


                           │
                ┌──────────┴──────────┐
                ▼                     ▼
            Reporting               Audit
                │                     │
                ▼                     ▼
          Reporting DB             Audit DB
```

The fundamental rule is:

> **A service owns its domain, owns its data, and exposes its capabilities through contracts. Other services consume those capabilities; they do not bypass the owner.**
