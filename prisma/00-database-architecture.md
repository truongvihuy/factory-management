# FMS Database Architecture

**Project:** Factory Management System (FMS)  
**Architecture:** Microservices  
**Database Strategy:** Database-per-Service  
**Primary DB:** PostgreSQL  
**ORM:** Prisma

## 1. Database Ownership

Each microservice owns its own database. Services must not query another service's database directly.

| Service | Database | Primary Responsibility |
|---|---|---|
| API Gateway | None | Routing, authentication propagation, rate limiting |
| Auth Service | `fms_auth` | Users, roles, permissions, sessions |
| Factory Service | `fms_factory` | Company, Factory, Workshop, Production Line, Machine, Sensor |
| Telemetry Service | `fms_telemetry` | Telemetry ingestion and history |
| Alert Service | `fms_alert` | Alert rules, alerts, notifications, escalation |
| Maintenance Service | `fms_maintenance` | Maintenance schedules, work orders, checklists, parts |
| Incident Service | `fms_incident` | Incidents, SLA, assignments, major incidents |
| Reporting Service | `fms_reporting` | Reporting read models, KPI snapshots, report definitions |
| Audit Service | `fms_audit` | Immutable audit records |

## 2. Cross-Service Identity

Cross-service references are stored as UUID values without database foreign keys.

Examples:

- `factoryId`
- `workshopId`
- `productionLineId`
- `machineId`
- `sensorId`
- `userId`
- `alertId`
- `incidentId`
- `workOrderId`

The owning service is responsible for validating that the referenced resource exists.

## 3. Why Database-per-Service

This is required by the selected microservice architecture.

Benefits:

- Independent deployment.
- Independent schema evolution.
- Failure isolation.
- Service ownership is explicit.
- No hidden coupling through database joins.
- Each service can optimize storage for its workload.

Trade-off:

- Cross-service transactions are not ACID transactions.
- Reporting requires replicated/read-model data.
- Data consistency between services is generally eventual.

## 4. PostgreSQL Decision

PostgreSQL is the baseline database for the MVP because most FMS domains are relational:

- organizational hierarchy
- authorization
- maintenance workflow
- incident workflow
- alert configuration
- audit records
- reporting metadata

Telemetry is the exceptional workload. The Telemetry Service should use PostgreSQL with a time-series optimization strategy. TimescaleDB can be introduced as a PostgreSQL extension without changing the service boundary.

The Prisma schema defines the relational model; time-series-specific objects such as hypertables should be created through SQL migrations where required.

## 5. Data Ownership Rules

### Auth Service owns

- User
- Role
- Permission
- UserRole
- RolePermission
- UserFactoryAccess
- RefreshToken

### Factory Service owns

- Company
- Factory
- Workshop
- ProductionLine
- Machine
- MachineAssignment
- Sensor
- SensorAssignment

### Telemetry Service owns

- TelemetryRecord

Telemetry records keep `machineId` and `sensorId` as immutable references.

### Alert Service owns

- AlertRule
- Alert
- AlertNotification
- AlertEscalation

### Maintenance Service owns

- MaintenanceSchedule
- WorkOrder
- WorkOrderChecklistItem
- WorkOrderPart
- MaintenanceHistory

### Incident Service owns

- Incident
- IncidentAssignment
- IncidentStatusHistory
- MajorIncident
- MajorIncidentIncident

### Reporting Service owns

- ReportDefinition
- KpiSnapshot
- MachineStatusSnapshot
- MaintenanceKpiSnapshot
- IncidentKpiSnapshot
- EnergyKpiSnapshot

These are reporting read models, not the transactional source of truth.

### Audit Service owns

- AuditLog

Audit records are append-only.

## 6. Cross-Service Event Direction

The database design assumes events are propagated asynchronously.

Examples:

```text
Factory Service
    └── MachineCreated
    └── MachineMoved
    └── SensorAssigned

Telemetry Service
    └── TelemetryReceived
    └── MachineStatusChanged

Alert Service
    └── AlertCreated
    └── AlertAcknowledged
    └── AlertResolved

Maintenance Service
    └── WorkOrderCreated
    └── WorkOrderCompleted

Incident Service
    └── IncidentCreated
    └── IncidentResolved
```

Reporting Service consumes business events and builds read models.

Audit Service consumes auditable events and stores immutable audit records.

## 7. Important Consistency Rule

Do not create database foreign keys between service databases.

Incorrect:

```text
Maintenance DB
    workOrder.machineId
        FK -> Factory DB.machine.id
```

Correct:

```text
Maintenance DB
    workOrder.machineId = UUID

Factory DB
    machine.id = UUID
```

The relationship is maintained by application-level validation and events.

## 8. Deletion Strategy

Historical business records should normally not be physically deleted.

Use status fields such as:

- ACTIVE
- INACTIVE
- RETIRED
- DISABLED

For immutable history:

- telemetry is append-only
- assignment history is append-only
- audit logs are append-only
- maintenance history is retained
- incident history is retained

## 9. Prisma Convention

All services use:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

Each service has its own `DATABASE_URL`.

Example:

```text
AUTH_DATABASE_URL
FACTORY_DATABASE_URL
TELEMETRY_DATABASE_URL
ALERT_DATABASE_URL
MAINTENANCE_DATABASE_URL
INCIDENT_DATABASE_URL
REPORTING_DATABASE_URL
AUDIT_DATABASE_URL
```
