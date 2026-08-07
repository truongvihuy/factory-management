# SRS-07. Business Rules

**Document Name:** Software Requirements Specification (SRS)  
**Section:** SRS-07 Business Rules  
**Project:** Factory Management System (FMS)  
**Version:** 1.0  
**Status:** Draft  

---

# 7. Business Rules

## 7.1 Overview

This document defines the business rules applied within the **Factory Management System (FMS)**.

Business rules describe mandatory constraints, validations, and operational policies that govern system behavior.

The purpose of this document is to ensure:

- Consistent business operations.
- Data integrity.
- Traceability of operational activities.
- Standardized workflows across factories.

Business rules are independent of technical implementation.

---

# 7.2 Business Rule Categories

The system business rules are categorized as follows:

| Rule Category | Description |
| ------------- | ----------- |
| BR-ORG | Organization Rules |
| BR-ASSET | Asset Management Rules |
| BR-SENSOR | Sensor Management Rules |
| BR-TELEMETRY | Telemetry Rules |
| BR-ALERT | Alert Management Rules |
| BR-MAINT | Maintenance Rules |
| BR-INCIDENT | Incident Rules |
| BR-USER | User & Authorization Rules |
| BR-DATA | Data Management Rules |
| BR-AUDIT | Audit Rules |

---

# 7.3 Organization Management Rules

## BR-ORG-001 Company Ownership

A Company may own one or more Factories.

Example:

```

Company A
|
├── Factory 01
├── Factory 02
└── Factory 03

```

---

## BR-ORG-002 Factory Relationship

Each Factory must belong to exactly one Company.

Rules:

- A Factory cannot exist without a Company.
- A Factory cannot belong to multiple Companies.

---

## BR-ORG-003 Workshop Relationship

Each Workshop must belong to exactly one Factory.

Rules:

- Workshop data is isolated by Factory.
- Workshop cannot be shared between factories.

---

## BR-ORG-004 Production Line Relationship

Each Production Line must belong to exactly one Workshop.

Rules:

- Production Line cannot exist independently.
- Production Line belongs to one Workshop only.

---

# 7.4 Machine Management Rules

## BR-ASSET-001 Machine Ownership

Each Machine must belong to exactly one Production Line.

Rules:

- A Machine cannot belong to multiple Production Lines simultaneously.
- Machine assignment history must be maintained.

---

## BR-ASSET-002 Machine Assignment History

When a Machine changes Production Line:

The system shall record:

- Previous Production Line.
- New Production Line.
- Effective Date.
- Changed By User.

Historical records must not be deleted.

---

## BR-ASSET-003 Machine Lifecycle

A Machine shall follow the defined lifecycle.

```

Draft
|
Installed
|
Running
|
Maintenance
|
Retired

```

Allowed states:

- Draft.
- Installed.
- Running.
- Idle.
- Maintenance.
- Offline.
- Error.
- Retired.

---

## BR-ASSET-004 Machine Retirement

A retired Machine:

- Cannot receive new telemetry.
- Cannot be assigned new sensors.
- Historical data remains available.

---

# 7.5 Sensor Management Rules

## BR-SENSOR-001 Sensor Ownership

A Sensor belongs to only one Machine at any point in time.

Rules:

- One Sensor cannot be assigned to multiple Machines.
- Sensor assignment history must be preserved.

---

## BR-SENSOR-002 Sensor Replacement

When replacing a Sensor:

The system shall record:

- Old Sensor.
- New Sensor.
- Machine.
- Replacement date.
- Replacement reason.

---

## BR-SENSOR-003 Historical Telemetry Association

Historical telemetry must remain linked to the original Sensor and Machine.

Example:

```

Sensor A
|
└── Machine 01
|
└── Telemetry History

Sensor A moved to Machine 02

Future telemetry:
Sensor A → Machine 02

Historical telemetry:
Sensor A → Machine 01

```

---

# 7.6 Telemetry Management Rules

## BR-TELEMETRY-001 Telemetry Immutable Rule

Telemetry data is append-only.

The system shall:

- Allow insertion.
- Allow querying.
- Prevent modification.
- Prevent deletion during retention period.

---

## BR-TELEMETRY-002 Telemetry Ownership

Each telemetry record must belong to:

- One Machine.
- One Sensor.
- One timestamp.

---

## BR-TELEMETRY-003 Telemetry Validation

Incoming telemetry must be validated before storage.

Validation includes:

- Device identity.
- Timestamp validity.
- Data format.
- Measurement value.

---

## BR-TELEMETRY-004 Telemetry Retention

Raw telemetry data:

- Stored for six months.
- Archived after retention period.

Summary data:

- Stored for five years.

---

# 7.7 Alert Management Rules

## BR-ALERT-001 Alert Generation

An Alert shall be generated when:

Telemetry data violates configured business rules.

Example:

```

Temperature > Maximum Threshold

↓

Generate Critical Alert

```

---

## BR-ALERT-002 Alert Severity

Alert severity levels:

| Level | Description |
| ----- | ----------- |
| Info | Informational event |
| Warning | Abnormal condition |
| Critical | Immediate attention required |

---

## BR-ALERT-003 Alert Lifecycle

Alert lifecycle:

```

Created
|
Acknowledged
|
Resolved
|
Closed

```

---

## BR-ALERT-004 Critical Alert Notification

Critical alerts shall:

- Notify responsible users immediately.
- Support escalation workflow.

---

# 7.8 Maintenance Management Rules

## BR-MAINT-001 Maintenance Types

The system supports:

- Preventive Maintenance.
- Corrective Maintenance.
- Predictive Maintenance.

---

## BR-MAINT-002 Work Order Requirement

Maintenance activities must have a Work Order.

A Work Order must contain:

- Machine.
- Maintenance type.
- Assigned engineer.
- Planned date.
- Status.

---

## BR-MAINT-003 Maintenance Checklist

Completed maintenance must include:

- Inspection items.
- Result.
- Technician.
- Notes.

---

## BR-MAINT-004 Maintenance History

Completed maintenance records cannot be deleted.

---

# 7.9 Incident Management Rules

## BR-INCIDENT-001 Incident Ownership

Each Incident must belong to exactly one Machine.

---

## BR-INCIDENT-002 Incident Lifecycle

Incident status flow:

```

Open
|
Assigned
|
In Progress
|
Resolved
|
Verified
|
Closed

```

---

## BR-INCIDENT-003 SLA Management

Critical incidents must comply with defined SLA.

Example:

| Priority | Requirement |
| -------- | ----------- |
| Critical | Response within 15 minutes |
| High | Response within defined SLA |

---

## BR-INCIDENT-004 Major Incident

Multiple related incidents may be grouped into one Major Incident.

---

# 7.10 User and Authorization Rules

## BR-USER-001 User Authentication

The MVP supports:

- Local Account authentication.

---

## BR-USER-002 User Access Scope

User access is controlled at Factory level.

Example:

```

User A

Allowed:
Factory 01
Factory 02

Denied:
Factory 03

```

---

## BR-USER-003 Role Assignment

Users must have assigned roles before accessing system functions.

---

## BR-USER-004 Disabled User

Disabled users:

- Cannot login.
- Cannot perform system operations.

---

# 7.11 Data Management Rules

## BR-DATA-001 Historical Data Protection

The following data cannot be deleted:

- Machine history.
- Sensor history.
- Telemetry history.
- Maintenance history.
- Incident history.
- Audit history.

---

## BR-DATA-002 Referential Integrity

The system shall prevent invalid relationships.

Examples:

- Machine without Production Line.
- Sensor without Machine.
- Telemetry without Machine.

---

## BR-DATA-003 Data Validation

Required fields must be completed before saving data.

---

# 7.12 Audit Rules

## BR-AUDIT-001 Audit Logging

The system shall record:

- User login.
- User logout.
- Create operations.
- Update operations.
- Delete operations.
- Permission changes.
- Configuration changes.

---

## BR-AUDIT-002 Audit Immutability

Audit records:

- Cannot be modified.
- Cannot be deleted by normal users.

---

# 7.13 Business Rule Traceability

| Business Domain | Related Rules |
| --------------- | ------------- |
| Organization Management | BR-ORG |
| Machine Management | BR-ASSET |
| Sensor Management | BR-SENSOR |
| Telemetry Management | BR-TELEMETRY |
| Alert Management | BR-ALERT |
| Maintenance Management | BR-MAINT |
| Incident Management | BR-INCIDENT |
| User Management | BR-USER |
| Data Management | BR-DATA |
| Audit Management | BR-AUDIT |

---

# Revision History

| Version | Date | Author | Description |
| ------- | ---- | ------ | ----------- |
| 1.0 | 2026-08-07 | Business Analyst | Initial version |
