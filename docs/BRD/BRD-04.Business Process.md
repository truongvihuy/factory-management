# BRD-04. Business Process

**Document Name:** Business Requirements Document (BRD)  
**Section:** BRD-04 Business Process  
**Project:** Factory Management System (FMS)

---

# 4. Business Process

## 4.1 Overview

This document describes the core business processes supported by the Factory Management System (FMS).

The objective is to standardize operational workflows across factories while ensuring traceability, consistency, and operational visibility.

The MVP supports the following business processes:

1. Asset Management
2. Machine Lifecycle
3. Sensor Lifecycle
4. Real-time Monitoring
5. Alert Management
6. Maintenance Management
7. Incident Management
8. User & Authorization Management
9. Reporting

---

# 4.2 Asset Management Process

## Purpose

Manage organizational assets and their hierarchical relationships.

## Workflow

```text
Create Company
        │
Create Factory
        │
Create Workshop
        │
Create Production Line
        │
Register Machine
        │
Assign Machine
        │
Assign Sensor
        │
Ready for Monitoring
```

## Business Rules

- Every Factory belongs to one Company.
- Every Workshop belongs to one Factory.
- Every Production Line belongs to one Workshop.
- Every Machine belongs to one Production Line.
- Every Sensor belongs to one Machine.

---

# 4.3 Machine Lifecycle Process

## Purpose

Manage the complete lifecycle of industrial machines.

## Workflow

```text
Register Machine
        │
Install Machine
        │
Assign Production Line
        │
Operate
        │
Maintenance
        │
Relocate (Optional)
        │
Retire
```

## Lifecycle States

- Draft
- Installed
- Running
- Idle
- Maintenance
- Offline
- Error
- Retired

## Business Rules

- A Machine can belong to only one Production Line at any point in time.
- Machine relocation history must always be retained.
- Historical telemetry shall remain unchanged after relocation.

---

# 4.4 Sensor Lifecycle Process

## Purpose

Manage sensor assignment throughout its operational lifecycle.

## Workflow

```text
Register Sensor
        │
Assign to Machine
        │
Collect Telemetry
        │
Replace / Move
        │
Assign to New Machine
```

## Business Rules

- One Sensor belongs to one Machine at a time.
- Assignment history must be preserved.
- Historical telemetry remains linked to the original Machine.
- Sensor replacement does not modify historical data.

---

# 4.5 Real-time Monitoring Process

## Purpose

Collect and monitor telemetry from industrial machines.

## Workflow

```text
Sensor
    │
Gateway
    │
IoT Protocol
    │
Telemetry Ingestion
    │
Validation
    │
Store Telemetry
    │
Update Dashboard
    │
Evaluate Alert Rules
```

## Supported Protocols

- MQTT
- OPC-UA
- Modbus TCP

## Typical Telemetry

- Temperature
- Vibration
- Speed
- Pressure
- Voltage
- Current
- Power
- Energy Consumption
- Machine Status

---

# 4.6 Alert Management Process

## Purpose

Detect abnormal machine conditions and notify responsible users.

## Workflow

```text
Telemetry Received
        │
Evaluate Threshold
        │
Generate Alert
        │
Send Notification
        │
User Acknowledgement
        │
Incident Created (Optional)
        │
Resolve
        │
Close Alert
```

## Alert Levels

- Info
- Warning
- Critical

## Notification Channels

- Dashboard
- Email
- Mobile Push Notification
- SMS (Critical Only)

## Escalation Flow

```text
Operator
      │
Supervisor
      │
Maintenance Engineer
      │
Factory Manager
```

Critical alerts notify all responsible users immediately.

---

# 4.7 Maintenance Management Process

## Purpose

Manage preventive, corrective, and predictive maintenance activities.

## Workflow

```text
Create Maintenance Schedule
            │
Approval
            │
Generate Work Order
            │
Assign Technician
            │
Perform Maintenance
            │
Complete Checklist
            │
Verification
            │
Close Work Order
            │
Maintenance History
```

## Maintenance Types

- Preventive
- Corrective
- Predictive

## Work Order Information

- Machine
- Maintenance Type
- Planned Date
- Assigned Technician
- Priority
- Status

## Checklist

Each Work Order shall contain:

- Inspection Items
- Result
- Technician
- Notes
- Attachments (Optional)

---

# 4.8 Incident Management Process

## Purpose

Manage machine failures and operational incidents.

## Workflow

```text
Alert (Optional)
        │
Create Incident
        │
Assign Engineer
        │
Investigation
        │
Repair
        │
Verification
        │
Close Incident
```

## Incident Status

- Open
- Assigned
- In Progress
- Resolved
- Verified
- Closed

## SLA Example

Critical Incident

- Response within 15 minutes.
- Engineer assigned within 1 hour.

## Business Rules

- One Incident belongs to one Machine.
- Multiple incidents may be grouped into one Major Incident.

---

# 4.9 User Management Process

## Purpose

Manage user accounts and permissions.

## Workflow

```text
Create User
        │
Assign Role
        │
Assign Factory
        │
Activate User
        │
Login
        │
Operate System
```

## Authentication

The MVP supports Local Account authentication.

## Authorization

Permissions are managed at the Factory level.

A User may access multiple Factories.

---

# 4.10 Reporting Process

## Purpose

Provide operational visibility and business insights.

## Workflow

```text
Collect Data
        │
Aggregate Data
        │
Generate KPI
        │
Display Dashboard
        │
Export Report
```

## Available Reports

- Machine Status
- Maintenance
- Incident
- Energy Consumption
- Operational KPI

## Export Formats

- PDF
- Excel

---

# 4.11 Data Retention Process

## Purpose

Manage telemetry data throughout its lifecycle.

## Workflow

```text
Telemetry
      │
Raw Storage
      │
6 Months
      │
Archive
      │
Historical Query
```

## Data Retention Policy

| Data Type     | Retention |
| ------------- | --------- |
| Raw Telemetry | 6 Months  |
| Summary Data  | 5 Years   |

Archived data shall remain searchable.

---

# 4.12 High-Level Business Process Map

```text
Organization
      │
Asset Management
      │
Machine Management
      │
Sensor Management
      │
Telemetry Collection
      │
Real-time Monitoring
      │
Alert Management
      │
Incident Management
      │
Maintenance Management
      │
Reporting
```

---

# 4.13 Business Process Relationships

```text
Machine
    │
    ├── Sensor
    │       │
    │       └── Telemetry
    │
    ├── Alert
    │
    ├── Incident
    │
    ├── Maintenance
    │
    └── Reporting
```

---

# 4.14 Business Process Success Criteria

The business processes are considered successful when:

- Assets are managed consistently across all factories.
- Machine status is updated in near real time.
- Alerts are generated within the required SLA.
- Maintenance follows an approved workflow.
- Incidents are resolved according to SLA.
- Historical data remains traceable.
- Operational dashboards accurately reflect factory status.
- Reports provide actionable business insights.

---

# 4.15 Process Assumptions

The following assumptions apply:

- IoT devices continuously send telemetry.
- Network interruptions may occur, and gateways are responsible for buffering data.
- Machine relocation is infrequent.
- Sensor replacement is infrequent.
- Historical operational data is immutable.
- Users are assigned appropriate factory-level permissions before accessing the system.
