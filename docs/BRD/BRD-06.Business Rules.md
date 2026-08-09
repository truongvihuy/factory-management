# BRD-06. Business Rules

**Document Name:** Business Requirements Document (BRD)  
**Section:** BRD-06 Business Rules  
**Project:** Factory Management System (FMS)

---

# 6. Business Rules

## 6.1 Overview

This document defines the business rules governing the Factory Management System (FMS).

Business Rules describe policies and constraints that ensure business consistency and data integrity. These rules are independent of technical implementation and must be enforced throughout the system.

---

# 6.2 Organization Rules

## BR-001 Company Hierarchy

A Company may own one or more Factories.

---

## BR-002 Factory Hierarchy

A Factory belongs to one Company.

A Factory may contain multiple Workshops.

---

## BR-003 Workshop Hierarchy

A Workshop belongs to one Factory.

A Workshop may contain multiple Production Lines.

---

## BR-004 Production Line Hierarchy

A Production Line belongs to one Workshop.

A Production Line may contain multiple Machines.

---

# 6.3 Machine Rules

## BR-005 Machine Assignment

A Machine shall belong to only one Production Line at any point in time.

---

## BR-006 Machine Relocation

A Machine may be reassigned to another Production Line.

When reassigned:

- Assignment history shall be retained.
- Effective date shall be recorded.
- Previous assignments shall never be deleted.

---

## BR-007 Machine Status

A Machine shall support the following statuses:

- Running
- Idle
- Stopped
- Maintenance
- Offline
- Error

---

## BR-008 Machine History

Machine maintenance history, incident history, and telemetry history shall be permanently retained.

---

# 6.4 Sensor Rules

## BR-009 Sensor Assignment

A Sensor shall belong to only one Machine at any point in time.

---

## BR-010 Sensor Relocation

A Sensor may be reassigned to another Machine.

When reassigned:

- Assignment history shall be retained.
- Historical telemetry remains associated with the original Machine.
- Existing telemetry records shall never be modified.

---

## BR-011 Sensor History

Sensor assignment history shall never be deleted.

---

# 6.5 Telemetry Rules

## BR-012 Supported Communication Protocols

The system shall support:

- MQTT
- OPC-UA
- Modbus TCP

---

## BR-013 Telemetry Frequency

Typical telemetry transmission intervals are:

| Sensor Type      | Frequency        |
| ---------------- | ---------------- |
| Critical Sensors | Every 1 second   |
| Normal Sensors   | Every 5 seconds  |
| Energy Sensors   | Every 30 seconds |

---

## BR-014 Telemetry Storage

Telemetry data is append-only.

Historical telemetry shall never be modified or deleted.

---

## BR-015 Telemetry Retention

| Data Type     | Retention Period |
| ------------- | ---------------- |
| Raw Telemetry | 6 Months         |
| Summary Data  | 5 Years          |

---

## BR-016 Archive Policy

Expired Raw Telemetry shall be archived.

Archived data must remain searchable.

---

## BR-017 Gateway Failure

When communication is interrupted:

- Gateway shall temporarily buffer telemetry.
- Buffered data shall be synchronized after reconnection.
- Long communication outages shall trigger alerts.

---

# 6.6 Alert Rules

## BR-018 Alert Threshold

Alert thresholds are configured individually for each Machine.

---

## BR-019 Alert Severity

Supported alert levels:

- Info
- Warning
- Critical

---

## BR-020 Alert Notification

Alert notifications shall be delivered through:

- Dashboard
- Email
- Mobile Push Notification

SMS notifications are reserved for Critical alerts only.

---

## BR-021 Alert Acknowledgement

Users shall acknowledge alerts after reviewing them.

Acknowledgement information shall be recorded.

---

## BR-022 Alert Escalation

Critical alerts shall notify all responsible users immediately.

Escalation order:

```text
Operator
      │
Supervisor
      │
Maintenance Engineer
      │
Factory Manager
```

---

# 6.7 Maintenance Rules

## BR-023 Maintenance Types

The system supports:

- Preventive Maintenance
- Corrective Maintenance
- Predictive Maintenance

---

## BR-024 Maintenance Approval

Maintenance schedules require approval before execution.

---

## BR-025 Maintenance Checklist

Every completed Work Order shall include a completed maintenance checklist.

Checklist records include:

- Inspection Items
- Technician
- Completion Result
- Notes
- Optional Attachments

---

## BR-026 Spare Parts

Maintenance activities may consume spare parts.

The system shall record:

- Spare Part
- Quantity
- Cost
- Supplier
- Replacement History

---

## BR-027 Maintenance History

Maintenance history shall never be deleted.

---

# 6.8 Incident Rules

## BR-028 Incident Scope

One Incident shall be associated with one Machine.

---

## BR-029 Major Incident

Multiple related Incidents may be grouped under one Major Incident.

---

## BR-030 Incident Workflow

Incident lifecycle:

```text
Open
   │
Assigned
   │
In Progress
   │
Resolved
   │
Verified
   │
Closed
```

---

## BR-031 Incident SLA

Example SLA:

Critical Incident

- Initial response within 15 minutes.
- Engineer assigned within 1 hour.

---

## BR-032 Incident History

Incident history shall never be deleted.

---

# 6.9 User Rules

## BR-033 Authentication

The MVP supports Local Account authentication.

---

## BR-034 User Assignment

A User may belong to multiple Factories.

---

## BR-035 Authorization Scope

Permissions are managed at the Factory level.

Users shall only access data belonging to assigned Factories.

---

## BR-036 User Status

A User may be:

- Active
- Inactive
- Locked

---

# 6.10 Reporting Rules

## BR-037 Standard Reports

The system shall provide:

- Machine Status Report
- Maintenance Report
- Incident Report
- Energy Report
- KPI Dashboard

---

## BR-038 Report Export

Reports may be exported as:

- PDF
- Excel

---

# 6.11 Audit Rules

## BR-039 Audit Logging

The system shall record:

- User Login
- User Logout
- User Management
- Machine Changes
- Configuration Changes
- Permission Changes
- Alert Configuration Changes

---

## BR-040 Audit Integrity

Audit logs shall not be modified or deleted by normal users.

---

# 6.12 Data Integrity Rules

## BR-041 Immutable Historical Data

Historical operational data shall be immutable.

---

## BR-042 Historical Traceability

All historical records must remain traceable.

---

## BR-043 Referential Integrity

Relationships between Company, Factory, Workshop, Production Line, Machine, and Sensor shall remain valid at all times.

---

# 6.13 Business Constraints

- Production Management is outside the MVP scope.
- Manufacturing Execution (MES) is outside the MVP scope.
- ERP integration is outside the MVP scope.
- Warehouse Management is outside the MVP scope.
- Financial Management is outside the MVP scope.

---

# 6.14 Rule Change Management

Business Rules may evolve over time.

Any modification to Business Rules shall:

- Be reviewed by the Product Owner.
- Be approved before implementation.
- Be version controlled.
- Maintain backward compatibility where applicable.
