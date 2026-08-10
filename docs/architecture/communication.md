# Communication Architecture

## 1. Purpose

This document defines how components and microservices in the Factory Management System (FMS) communicate with each other.

It establishes:

- External API communication
- Internal synchronous communication
- Internal asynchronous communication
- REST conventions
- gRPC conventions
- RabbitMQ messaging
- Event contracts
- Timeout and retry policies
- Idempotency
- Transactional Outbox
- Failure handling
- Trace and correlation propagation
- Communication anti-patterns

The objective is to provide reliable, predictable, and loosely coupled communication between services.

---

# 2. Communication Principles

The system follows these principles:

1. REST is used for external client communication.
2. gRPC is used for synchronous internal service-to-service communication.
3. RabbitMQ is used for asynchronous communication.
4. Services communicate through explicit contracts.
5. Services must not access another service's database directly.
6. Asynchronous consumers must be idempotent.
7. Retry behavior must be explicitly designed.
8. Timeouts are mandatory for synchronous remote calls.
9. Events should represent domain facts.
10. Trace and correlation information must propagate across service boundaries.
11. Database changes and event publication should use Transactional Outbox when consistency is required.
12. Communication failures must be isolated and observable.

---

# 3. Communication Overview

```text
                         External Clients
                                │
                                │ HTTPS / REST
                                ▼
                       ┌─────────────────┐
                       │   API Gateway   │
                       └────────┬────────┘
                                │
                                │ Internal
                                │ gRPC
             ┌──────────────────┼──────────────────┐
             │                  │                  │
             ▼                  ▼                  ▼
        Auth Service      Factory Service    Telemetry Service
             │                  │                  │
             │                  │                  │
             └──────────────────┼──────────────────┘
                                │
                                │ Events
                                ▼
                         ┌──────────────┐
                         │  RabbitMQ    │
                         └───────┬──────┘
                                 │
                  ┌──────────────┼──────────────┐
                  │              │              │
                  ▼              ▼              ▼
               Alert        Maintenance      Incident
               Service        Service         Service
                  │              │              │
                  └──────────────┼──────────────┘
                                 │
                         ┌───────┴───────┐
                         ▼               ▼
                    Reporting          Audit
                     Service           Service
```

---

# 4. Communication Types

The architecture has three primary communication paths.

| Communication         | Protocol     | Direction                  | Purpose                         |
| --------------------- | ------------ | -------------------------- | ------------------------------- |
| External API          | REST / HTTPS | Client → Gateway           | Public API                      |
| Internal synchronous  | gRPC         | Service ↔ Service          | Immediate request/response      |
| Internal asynchronous | RabbitMQ     | Service → Broker → Service | Events and background workflows |

---

# 5. External Communication

External clients communicate only through the API Gateway.

```text
Client
   │
   │ HTTPS
   ▼
API Gateway
   │
   ▼
Internal Services
```

Clients should not directly access internal service endpoints.

---

# 6. REST Communication

REST is the external API protocol.

Example:

```text
GET    /api/v1/machines
GET    /api/v1/machines/:id
POST   /api/v1/machines
PATCH  /api/v1/machines/:id
DELETE /api/v1/machines/:id
```

REST APIs should be:

- Resource-oriented
- Versioned
- Stateless
- Consistent
- Explicitly validated

---

# 7. API Versioning

External APIs should be versioned.

Recommended:

```text
/api/v1/...
```

Example:

```text
GET /api/v1/machines
```

A breaking API change should result in a new version rather than silently changing an existing contract.

---

# 8. API Gateway Responsibilities

The API Gateway handles concerns related to external API access.

Responsibilities include:

- Request routing
- Authentication integration
- Authorization integration
- Rate limiting
- Request validation
- Request correlation
- API versioning
- External response mapping
- API observability

The Gateway must not contain business logic belonging to individual services.

---

# 9. Internal Communication

Internal service-to-service communication uses:

```text
gRPC
```

for synchronous request/response operations.

Example:

```text
Maintenance Service
        │
        │ gRPC
        ▼
Factory Service
        │
        ▼
"Get machine information"
```

---

# 10. When to Use gRPC

Use gRPC when the caller requires an immediate result.

Typical use cases:

- Query another service
- Validate an entity
- Execute a synchronous command
- Retrieve authorization information
- Retrieve metadata required for immediate processing

Example:

```text
Incident Service
      │
      │ gRPC
      ▼
Factory Service
      │
      ▼
Get Machine
```

The Incident Service can immediately determine whether the machine exists.

---

# 11. When Not to Use gRPC

Do not use gRPC when the caller does not need an immediate response.

Avoid:

```text
Telemetry
   │
   │ gRPC
   ▼
Alert
   │
   │ gRPC
   ▼
Reporting
   │
   │ gRPC
   ▼
Audit
```

This creates a synchronous dependency chain.

Prefer:

```text
Telemetry
    │
    ▼
RabbitMQ
    │
    ├──► Alert
    ├──► Reporting
    └──► Audit
```

This reduces coupling and improves failure isolation.

---

# 12. gRPC Contract

Internal gRPC communication must be contract-first.

Contracts are defined using Protocol Buffers.

Example:

```protobuf
service FactoryService {
  rpc GetMachine(GetMachineRequest)
      returns (GetMachineResponse);
}
```

The `.proto` definition is the source of truth.

Generated code should be used by clients and servers.

---

# 13. gRPC Contract Ownership

The service that owns the capability owns the contract.

Example:

```text
Factory Service
      │
      ▼
factory.proto
```

Other services consume the contract.

They must not independently redefine the same operation.

---

# 14. gRPC Communication Flow

Example:

```text
Maintenance Service
        │
        │ GetMachine(machineId)
        ▼
Factory Service
        │
        ▼
Factory Database
        │
        ▼
Machine Response
        │
        ▼
Maintenance Service
```

The Factory Service remains the authoritative owner of machine data.

---

# 15. gRPC Timeout

Every remote gRPC call must have a deadline.

Conceptually:

```text
Caller
   │
   │ request
   │ timeout = T
   ▼
Service
```

Never allow an internal remote call to wait indefinitely.

Timeouts should be chosen based on the operation.

Example categories:

```text
Fast lookup
    → short timeout

Normal command
    → moderate timeout

Long-running operation
    → asynchronous workflow
```

Long-running work should generally not be implemented as a long-lived synchronous request.

---

# 16. gRPC Retry

Retries should be used carefully.

Retry only when:

- The error is transient.
- The operation is safe to retry.
- A bounded retry policy exists.

Example:

```text
Attempt 1
   ↓
Failure
   ↓
Backoff
   ↓
Attempt 2
   ↓
Failure
   ↓
Backoff
   ↓
Attempt 3
   ↓
Failure
   ↓
Return Error
```

Do not blindly retry every error.

Do not retry:

```text
INVALID_ARGUMENT
NOT_FOUND
PERMISSION_DENIED
```

unless the specific operation has a valid reason.

---

# 17. gRPC Status Codes

Services should use standard gRPC status codes.

Common mappings:

| Situation               | gRPC Status           |
| ----------------------- | --------------------- |
| Invalid input           | `INVALID_ARGUMENT`    |
| Missing authentication  | `UNAUTHENTICATED`     |
| Insufficient permission | `PERMISSION_DENIED`   |
| Resource not found      | `NOT_FOUND`           |
| Resource already exists | `ALREADY_EXISTS`      |
| Invalid state           | `FAILED_PRECONDITION` |
| Timeout                 | `DEADLINE_EXCEEDED`   |
| Temporary unavailable   | `UNAVAILABLE`         |
| Unexpected failure      | `INTERNAL`            |

Internal implementation details must not be exposed through error messages.

---

# 18. RabbitMQ

RabbitMQ is the asynchronous messaging infrastructure.

It is used for:

- Domain events
- Background processing
- Cross-service workflows
- Audit processing
- Reporting projections
- Alert processing
- Decoupled communication

---

# 19. Event-Driven Communication

The general event flow is:

```text
Producer
   │
   │ Event
   ▼
RabbitMQ Exchange
   │
   ├────► Queue A ───► Consumer A
   │
   ├────► Queue B ───► Consumer B
   │
   └────► Queue C ───► Consumer C
```

A producer should not need to know every consumer.

This creates loose coupling.

---

# 20. Event vs Command

Events represent facts that have already happened.

Examples:

```text
machine.registered
telemetry.received
alert.created
maintenance.completed
incident.resolved
```

Commands represent requests to perform an action.

Example:

```text
CreateMaintenanceTask
```

The system should distinguish between:

```text
Fact
```

and:

```text
Request
```

Events generally use past-tense domain semantics.

---

# 21. Event Naming

Recommended format:

```text
<entity>.<action>
```

Examples:

```text
user.created
machine.registered
machine.updated
sensor.registered
telemetry.received
alert.created
alert.resolved
maintenance.completed
incident.created
incident.resolved
```

Event names should be stable and domain-oriented.

---

# 22. Event Ownership

The service that owns the domain entity is responsible for publishing events about changes to that entity.

Example:

```text
Factory Service
      │
      ├── machine.registered
      ├── machine.updated
      └── machine.disabled
```

Alert Service should not publish:

```text
machine.updated
```

because Alert Service does not own machines.

---

# 23. Event Envelope

Events should use a common envelope.

Example:

```typescript
interface DomainEvent<T> {
  eventId: string;
  eventType: string;
  version: number;
  occurredAt: string;
  source: string;
  correlationId?: string;
  causationId?: string;
  data: T;
}
```

The envelope provides common metadata for:

- Tracing
- Idempotency
- Debugging
- Versioning
- Event routing

---

# 24. Event Versioning

Events are contracts.

Breaking changes should not silently modify an existing event schema.

Example:

```text
machine.registered.v1
machine.registered.v2
```

Alternatively, versioning may be represented inside the event envelope:

```json
{
  "eventType": "machine.registered",
  "version": 2
}
```

The project should use one consistent convention once the event contract implementation is finalized.

---

# 25. Event Delivery

RabbitMQ provides message delivery infrastructure, but consumers must assume duplicate delivery can occur.

Therefore:

```text
At-least-once delivery
        ↓
Idempotent consumer
```

is the default reliability model.

---

# 26. Idempotent Consumers

Every important event consumer must be idempotent.

Example:

```text
Receive event
     │
     ▼
Check eventId
     │
     ├── Already processed
     │        │
     │        ▼
     │      Ignore
     │
     └── New event
              │
              ▼
          Process
              │
              ▼
       Mark processed
```

The consumer must not produce duplicate business effects when the same event is delivered more than once.

---

# 27. Event Deduplication

A consumer may maintain a processed-event record.

Example:

```text
processed_events
----------------
event_id
consumer
processed_at
```

A uniqueness constraint should prevent duplicate processing.

Example conceptual constraint:

```text
UNIQUE(event_id, consumer)
```

The exact implementation depends on the service.

---

# 28. Transactional Outbox

When a business transaction must reliably produce an event, use Transactional Outbox.

Example:

```text
Database Transaction
        │
        ├── Update Business Data
        │
        └── Insert Outbox Event
                │
                ▼
             Commit
                │
                ▼
         Outbox Publisher
                │
                ▼
             RabbitMQ
```

This guarantees that the business state and the intent to publish the event are committed together.

---

# 29. Outbox Publisher

The Outbox Publisher is responsible for publishing pending events.

Conceptually:

```text
Outbox
  │
  ├── Pending
  │
  ├── Publishing
  │
  ├── Published
  │
  └── Failed
```

Failed messages should be retried according to a controlled policy.

---

# 30. RabbitMQ Exchange Strategy

The messaging topology should use exchanges to decouple producers from consumers.

Conceptually:

```text
Service
   │
   ▼
Exchange
   │
   ├── Queue → Consumer
   ├── Queue → Consumer
   └── Queue → Consumer
```

The exact exchange types and routing keys should be defined when the messaging topology is implemented.

For domain events, topic-style routing is generally suitable because multiple consumers may subscribe to different event types.

---

# 31. Queue Ownership

Queues belong to consumers.

Example:

```text
alert-service.queue
maintenance-service.queue
reporting-service.queue
audit-service.queue
```

Each service should own and manage its queues.

A producer should not directly manage another service's consumer queue.

---

# 32. Dead Letter Queue

Messages that cannot be successfully processed after the configured retry policy should be moved to a Dead Letter Queue.

```text
RabbitMQ
   │
   ▼
Consumer Queue
   │
   ▼
Processing Failure
   │
   ▼
Retry
   │
   ├── Success
   │
   └── Failure
          │
          ▼
        DLQ
```

DLQ messages require operational monitoring and a defined recovery procedure.

---

# 33. Retry Strategy

Retries should use bounded backoff.

Conceptually:

```text
Attempt 1
    ↓
Failure
    ↓
Backoff
    ↓
Attempt 2
    ↓
Failure
    ↓
Backoff
    ↓
Attempt 3
    ↓
Failure
    ↓
DLQ
```

Avoid infinite retries.

Infinite retry loops can create:

- CPU consumption
- Queue growth
- Repeated failures
- Cascading system instability

---

# 34. Poison Messages

A poison message is a message that repeatedly fails because the payload or processing logic is invalid.

It must not remain in an infinite retry loop.

Expected flow:

```text
Message
   ↓
Consumer
   ↓
Failure
   ↓
Retry Limit
   ↓
DLQ
```

The DLQ allows engineers to inspect and recover the message without blocking healthy messages.

---

# 35. Message Ordering

Consumers must not assume global ordering.

If ordering is required, it must be explicitly designed around a relevant ordering key.

For example:

```text
machineId
```

may be used to preserve ordering for telemetry or machine state events where required.

Global ordering across the entire system should not be assumed.

---

# 36. Eventual Consistency

Asynchronous communication introduces eventual consistency.

Example:

```text
Factory Service
      │
      │ machine.registered
      ▼
RabbitMQ
      │
      ▼
Reporting Service
```

The Reporting Service may temporarily not know about the newly registered machine.

This is expected.

Consumers must be designed to tolerate propagation delay.

---

# 37. Service Communication Matrix

| Producer            | Consumer    | Communication | Purpose                  |
| ------------------- | ----------- | ------------- | ------------------------ |
| API Gateway         | Auth        | gRPC          | Authentication           |
| API Gateway         | Factory     | gRPC          | Factory operations       |
| API Gateway         | Telemetry   | gRPC          | Telemetry operations     |
| API Gateway         | Alert       | gRPC          | Alert operations         |
| API Gateway         | Maintenance | gRPC          | Maintenance operations   |
| API Gateway         | Incident    | gRPC          | Incident operations      |
| API Gateway         | Reporting   | gRPC          | Report queries           |
| API Gateway         | Audit       | gRPC          | Audit queries            |
| Telemetry           | Alert       | RabbitMQ      | Telemetry events         |
| Telemetry           | Reporting   | RabbitMQ      | Telemetry projection     |
| Telemetry           | Audit       | RabbitMQ      | Audit trail              |
| Factory             | Alert       | RabbitMQ      | Asset changes            |
| Factory             | Maintenance | RabbitMQ      | Asset changes            |
| Factory             | Incident    | RabbitMQ      | Asset changes            |
| Factory             | Reporting   | RabbitMQ      | Asset projection         |
| Factory             | Audit       | RabbitMQ      | Audit trail              |
| Alert               | Maintenance | RabbitMQ      | Alert-driven maintenance |
| Alert               | Incident    | RabbitMQ      | Incident creation        |
| Alert               | Reporting   | RabbitMQ      | Alert projection         |
| Alert               | Audit       | RabbitMQ      | Audit trail              |
| Maintenance         | Incident    | RabbitMQ      | Maintenance events       |
| Maintenance         | Reporting   | RabbitMQ      | Maintenance projection   |
| Maintenance         | Audit       | RabbitMQ      | Audit trail              |
| Incident            | Reporting   | RabbitMQ      | Incident projection      |
| Incident            | Audit       | RabbitMQ      | Audit trail              |
| All domain services | Audit       | RabbitMQ      | Audit events             |

This matrix represents the initial architecture and may evolve with implementation.

---

# 38. Avoid Communication Explosion

A microservice architecture should not result in every service communicating directly with every other service.

Bad:

```text
A ─── B
│ ╲   │
│  ╲  │
C ─── D
│ ╲   │
E ─── F
```

This creates a highly connected system.

Prefer clear communication paths:

```text
             RabbitMQ
                 │
       ┌─────────┼─────────┐
       ▼         ▼         ▼
     Alert   Reporting    Audit
```

and synchronous calls only where immediate responses are genuinely required.

---

# 39. Synchronous Chain Limits

Avoid long synchronous chains.

Bad:

```text
Gateway
   ↓
Incident
   ↓
Alert
   ↓
Factory
   ↓
Auth
```

Every additional hop introduces:

- Latency
- Failure probability
- Operational complexity
- Timeout propagation

Prefer local decisions or asynchronous workflows where possible.

---

# 40. Timeout Propagation

A request may pass through multiple components.

Example:

```text
Client
  │
  ▼
Gateway
  │
  ▼
Service A
  │
  ▼
Service B
```

The total timeout budget must account for all downstream calls.

A service should not configure a downstream timeout longer than the remaining request deadline.

---

# 41. Circuit Breaking

Circuit breaking may be introduced for critical synchronous dependencies.

Conceptually:

```text
Normal
  │
  ▼
Service B
  │
Failures increase
  │
  ▼
Open Circuit
  │
  ▼
Fail Fast
  │
  ▼
Recovery Check
  │
  ▼
Half Open
  │
  ▼
Healthy → Closed
```

Circuit breaking should be applied based on measured failure characteristics rather than added everywhere.

---

# 42. Rate Limiting

Rate limiting should primarily be enforced at the API Gateway.

Potential dimensions include:

- Client
- User
- IP
- API route
- Tenant
- Organization

Internal services may implement additional protection for expensive operations.

---

# 43. Backpressure

High-volume workloads must have backpressure mechanisms.

This is particularly important for:

```text
Telemetry
RabbitMQ
Reporting
Alert processing
```

Possible mechanisms include:

- Queue limits
- Consumer concurrency limits
- RabbitMQ prefetch
- Rate limiting
- Batch processing
- Controlled ingestion

The system must prevent downstream overload from causing uncontrolled resource consumption.

---

# 44. Telemetry Communication

Telemetry is expected to be one of the highest-throughput communication paths.

Conceptually:

```text
Machines
   │
   │ telemetry
   ▼
Telemetry Service
   │
   ├── Store telemetry
   │
   └── Publish relevant events
          │
          ▼
       RabbitMQ
          │
          ├── Alert
          ├── Reporting
          └── Audit
```

Raw telemetry should not necessarily be broadcast to every service.

Events should be designed according to actual consumer requirements.

---

# 45. Large Payloads

Do not use RabbitMQ as a large-object storage mechanism.

Avoid publishing excessively large messages.

Bad:

```text
Telemetry Event
└── Entire historical telemetry dataset
```

Prefer:

```text
Telemetry Event
├── eventId
├── machineId
├── timestamp
└── relevant measurements
```

Large datasets should remain in appropriate storage and be queried through the owning service when necessary.

---

# 46. Communication Security

External communication must use HTTPS.

Internal communication should also be secured according to the deployment environment.

Security mechanisms may include:

- TLS
- Service authentication
- Authorization
- Network policies
- Credential rotation
- Secret management

Internal network access must not be treated as inherently trusted.

---

# 47. Trace Propagation

Distributed tracing metadata must propagate across communication boundaries.

Example:

```text
Client
  │
  │ traceId
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
  │ traceId
  ▼
Audit Service
```

OpenTelemetry should be used to standardize trace propagation.

---

# 48. Correlation ID

A correlation ID identifies a logical business operation across multiple components.

Example:

```text
correlationId = 8d3...
```

The same correlation ID may appear in:

- HTTP headers
- gRPC metadata
- RabbitMQ message headers
- Logs
- Audit records

Correlation IDs should not replace distributed tracing; they complement it.

---

# 49. Observability

Communication failures must be observable.

At minimum, capture:

```text
Request count
Error count
Latency
Timeouts
Retries
Queue depth
Consumer failures
DLQ count
Message processing latency
```

OpenTelemetry provides the instrumentation foundation.

Prometheus provides metrics collection.

Grafana provides visualization.

Jaeger or Tempo provides distributed tracing.

---

# 50. Communication Failure Model

The system assumes that remote communication can fail.

Possible failures include:

```text
Service unavailable
Network timeout
Connection reset
Message duplication
Message delay
Message loss after application failure
Consumer crash
Broker unavailable
Database unavailable
```

Every communication path must define how these failures are handled.

---

# 51. Failure Handling Strategy

### Synchronous

```text
Request
   │
   ▼
Remote Service
   │
   ├── Success → Return Response
   │
   ├── Timeout → Fail / Retry if safe
   │
   └── Unavailable → Fail Fast / Fallback
```

### Asynchronous

```text
Publish
   │
   ▼
RabbitMQ
   │
   ▼
Consumer
   │
   ├── Success → ACK
   │
   └── Failure
          │
          ▼
        Retry
          │
          ▼
        DLQ
```

---

# 52. Communication Anti-Patterns

The following patterns are prohibited unless explicitly justified.

## Direct Database Access

```text
Service A → Service B DB
```

---

## Shared Database

```text
Service A ─┐
Service B ─┼→ Same Database
Service C ─┘
```

---

## Infinite Retry

```text
Failure
  ↓
Retry
  ↓
Retry
  ↓
Retry
  ↓
...
```

---

## Synchronous Event Broadcasting

```text
Service A
   │
   ├── gRPC → B
   ├── gRPC → C
   ├── gRPC → D
   └── gRPC → E
```

Prefer asynchronous events when immediate responses are not required.

---

## Large Message Payloads

Do not use RabbitMQ to transfer large datasets.

---

## Business Logic in Gateway

The Gateway must not become a centralized business service.

---

# 53. Communication Decision Matrix

When choosing communication mechanisms:

| Requirement                  | Recommended      |
| ---------------------------- | ---------------- |
| External API                 | REST             |
| Immediate internal query     | gRPC             |
| Immediate internal command   | gRPC             |
| Domain event                 | RabbitMQ         |
| Background processing        | RabbitMQ         |
| Audit propagation            | RabbitMQ         |
| Reporting projection         | RabbitMQ         |
| Long-running workflow        | Async / RabbitMQ |
| High-volume event processing | RabbitMQ         |
| Shared database access       | Not allowed      |

---

# 54. Communication Rules

The following rules are considered architectural constraints:

1. External clients communicate through the API Gateway.
2. REST is the external API protocol.
3. gRPC is the default synchronous internal protocol.
4. RabbitMQ is the default asynchronous messaging mechanism.
5. Every synchronous remote call has a timeout.
6. Retries must be bounded.
7. Consumers must be idempotent.
8. Important database-to-event workflows use Transactional Outbox.
9. Services must not access another service's database.
10. Events must have explicit contracts.
11. Event consumers must tolerate duplicate delivery.
12. DLQ handling must exist for failed messages.
13. Trace and correlation metadata must propagate.
14. Communication must be observable.
15. Large datasets must not be transported through RabbitMQ.
16. Long synchronous chains should be avoided.

---

# 55. Example End-to-End Workflow

Consider a machine generating abnormal temperature data.

```text
Machine
   │
   │ Telemetry
   ▼
Telemetry Service
   │
   ├── Store telemetry
   │
   └── Publish telemetry.received
             │
             ▼
          RabbitMQ
             │
             ▼
        Alert Service
             │
             ├── Evaluate rule
             │
             └── Create Alert
                    │
                    └── alert.created
                           │
                           ▼
                        RabbitMQ
                           │
                  ┌────────┴────────┐
                  ▼                 ▼
             Incident          Audit
              Service          Service
                  │
                  └── incident.created
```

This workflow demonstrates the preferred event-driven model.

The Telemetry Service does not need to synchronously call Alert, Incident, Audit, and Reporting services.

---

# 56. Architecture Summary

The FMS communication model can be summarized as:

```text
                 External World
                       │
                       │ REST / HTTPS
                       ▼
                ┌──────────────┐
                │ API Gateway  │
                └──────┬───────┘
                       │
                       │ gRPC
          ┌────────────┼────────────┐
          │            │            │
          ▼            ▼            ▼
       Service A    Service B    Service C
          │            │            │
          └────────────┼────────────┘
                       │
                       │ Events
                       ▼
                 ┌───────────┐
                 │ RabbitMQ  │
                 └─────┬─────┘
                       │
             ┌─────────┼─────────┐
             ▼         ▼         ▼
          Consumer  Consumer  Consumer
```

The fundamental communication strategy is:

> **Use REST for external access, gRPC for synchronous internal operations, and RabbitMQ for asynchronous events.**

This separation keeps communication predictable while allowing services to scale and fail independently.
