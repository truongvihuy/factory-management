# SRS-05. Use Case Specification

**Document Name:** Software Requirements Specification (SRS)  
**Section:** SRS-05 Use Case Specification  
**Project:** Factory Management System (FMS)  
**Version:** 1.0  
**Status:** Draft  

---

# 5. Use Case Specification

## 5.1 Overview

This document defines the detailed Use Case Specifications for the **Factory Management System (FMS)**.

Use Cases describe how actors interact with the system to achieve business goals.

Each Use Case includes:

- Use Case ID
- Use Case Name
- Actors
- Preconditions
- Main Flow
- Alternative Flow
- Exception Flow
- Postconditions
- Business Rules

---

# 5.2 Use Case List

| Use Case ID | Use Case Name |
| ----------- | ------------- |
| UCS-01 | Organization Management |
| UCS-02 | Factory Management |
| UCS-03 | Workshop Management |
| UCS-04 | Production Line Management |
| UCS-05 | Machine Management |
| UCS-06 | Sensor Management |
| UCS-07 | Telemetry Management |
| UCS-08 | Alert Management |
| UCS-09 | Maintenance Management |
| UCS-10 | Incident Management |
| UCS-11 | User Management |
| UCS-12 | Authorization Management |
| UCS-13 | Dashboard Monitoring |
| UCS-14 | Reporting |
| UCS-15 | Audit Log Management |

---

# UCS-01 Organization Management

## Use Case Name

Manage Company Information

## Actors

- System Administrator

## Description

Allows authorized users to create, update, view, and manage company information.

---

## Preconditions

- User is authenticated.
- User has Organization Management permission.

---

## Main Flow

1. User accesses Company Management.
2. User selects Create Company.
3. User enters company information.
4. System validates input data.
5. System creates company record.
6. System displays successful creation message.

---

## Alternative Flow

### Update Company

1. User selects existing company.
2. User updates information.
3. System validates changes.
4. System saves updated information.

---

## Exception Flow

- Invalid company information.
- Duplicate company code.
- User does not have permission.

---

## Postconditions

- Company information is stored successfully.
- Company becomes available for factory assignment.

---

## Business Rules

- One Company can contain multiple Factories.
- Company information history must be maintained.

---

# UCS-02 Factory Management

## Use Case Name

Manage Factory Information

## Actors

- System Administrator
- Factory Manager

---

## Description

Allows users to manage factories belonging to companies.

---

## Preconditions

- User is authenticated.
- Company exists.

---

## Main Flow

1. User accesses Factory Management.
2. User creates or updates factory information.
3. System validates factory data.
4. System stores factory information.
5. System displays factory details.

---

## Alternative Flow

- View factory information.
- Disable factory.

---

## Exception Flow

- Company does not exist.
- Duplicate factory code.

---

## Postconditions

- Factory information is available.
- Factory can contain workshops.

---

## Business Rules

- One Factory belongs to one Company.
- One Company can have multiple Factories.

---

# UCS-03 Workshop Management

## Use Case Name

Manage Workshop Information

## Actors

- System Administrator
- Factory Manager

---

## Description

Allows users to manage workshops inside factories.

---

## Preconditions

- Factory exists.
- User has permission.

---

## Main Flow

1. User accesses Workshop Management.
2. User creates workshop.
3. User enters workshop information.
4. System validates data.
5. System stores workshop.

---

## Alternative Flow

- Update workshop.
- Deactivate workshop.

---

## Exception Flow

- Factory not found.
- Duplicate workshop code.

---

## Postconditions

- Workshop is created successfully.

---

## Business Rules

- One Factory can contain multiple Workshops.
- One Workshop belongs to one Factory.

---

# UCS-04 Production Line Management

## Use Case Name

Manage Production Line Information

## Actors

- System Administrator
- Factory Manager

---

## Description

Manage production lines within workshops.

---

## Preconditions

- Workshop exists.

---

## Main Flow

1. User creates production line.
2. User enters production line information.
3. System validates information.
4. System stores production line.

---

## Alternative Flow

- Update production line.
- Deactivate production line.

---

## Exception Flow

- Workshop does not exist.
- Duplicate production line code.

---

## Postconditions

- Production line is available for machine assignment.

---

## Business Rules

- One Workshop contains multiple Production Lines.
- One Machine belongs to one Production Line at a time.

---

# UCS-05 Machine Management

## Use Case Name

Manage Machine Lifecycle

## Actors

- Factory Manager
- Production Supervisor
- Maintenance Engineer

---

## Description

Allows users to manage industrial machines throughout their lifecycle.

---

## Preconditions

- Production Line exists.
- User has machine permission.

---

## Main Flow

1. User accesses Machine Management.
2. User registers machine.
3. User enters machine information.
4. System validates information.
5. System creates machine.
6. User assigns machine to production line.
7. System stores assignment history.

---

## Alternative Flow

### Move Machine

1. User selects machine.
2. User chooses new production line.
3. System creates new assignment record.
4. Previous assignment is closed.

---

## Exception Flow

- Production line does not exist.
- Machine code already exists.
- User lacks permission.

---

## Postconditions

- Machine is available for monitoring.
- Assignment history is maintained.

---

## Business Rules

- Machine belongs to only one Production Line at a time.
- Historical assignment cannot be deleted.

---

# UCS-06 Sensor Management

## Use Case Name

Manage Sensor Assignment

## Actors

- Maintenance Engineer
- System Administrator

---

## Description

Manage IoT sensor registration and assignment.

---

## Preconditions

- Machine exists.

---

## Main Flow

1. User registers sensor.
2. User assigns sensor to machine.
3. System validates assignment.
4. System stores sensor information.

---

## Alternative Flow

### Replace Sensor

1. User removes old sensor.
2. User assigns new sensor.
3. System preserves history.

---

## Exception Flow

- Sensor already assigned.
- Machine does not exist.

---

## Postconditions

- Sensor is ready for telemetry collection.

---

## Business Rules

- Sensor belongs to one Machine at a time.
- Sensor history cannot be deleted.

---

# UCS-07 Telemetry Management

## Use Case Name

Collect and Monitor Telemetry

## Actors

- IoT Gateway
- System

---

## Description

Receive and process telemetry data from machines.

---

## Preconditions

- Sensor is registered.
- Gateway connection exists.

---

## Main Flow

1. Sensor sends telemetry.
2. Gateway forwards data.
3. System receives telemetry.
4. System validates data.
5. System stores telemetry.
6. System updates monitoring data.

---

## Exception Flow

- Invalid telemetry format.
- Connection failure.

---

## Postconditions

- Telemetry is stored.
- Machine status is updated.

---

## Business Rules

- Telemetry data is immutable.
- Historical data must remain traceable.

---

# UCS-08 Alert Management

## Use Case Name

Manage Machine Alerts

## Actors

- System
- Operator
- Maintenance Engineer

---

## Description

Detect abnormal conditions and manage alerts.

---

## Preconditions

- Telemetry exists.
- Alert rules are configured.

---

## Main Flow

1. System receives telemetry.
2. System evaluates rules.
3. System creates alert.
4. System sends notification.
5. User acknowledges alert.
6. User resolves alert.

---

## Exception Flow

- Missing alert configuration.
- Notification failure.

---

## Postconditions

- Alert history is stored.

---

## Business Rules

- Critical alerts require immediate notification.

---

# UCS-09 Maintenance Management

## Use Case Name

Manage Maintenance Activities

## Actors

- Maintenance Planner
- Maintenance Engineer

---

## Description

Manage maintenance schedules and work orders.

---

## Preconditions

- Machine exists.

---

## Main Flow

1. User creates maintenance schedule.
2. System generates work order.
3. Engineer performs maintenance.
4. Engineer completes checklist.
5. System records maintenance history.

---

## Exception Flow

- Work order incomplete.
- Machine unavailable.

---

## Postconditions

- Maintenance activity is recorded.

---

# UCS-10 Incident Management

## Use Case Name

Manage Operational Incident

## Actors

- Operator
- Maintenance Engineer
- Factory Manager

---

## Main Flow

1. Incident is created.
2. Incident is assigned.
3. Engineer investigates.
4. Resolution is performed.
5. Incident is verified.
6. Incident is closed.

---

## Business Rules

- Incident must belong to one Machine.
- Incident lifecycle must be maintained.

---

# UCS-11 User Management

## Use Case Name

Manage User Account

## Actors

- System Administrator

---

## Main Flow

1. Administrator creates user.
2. Assigns user information.
3. Activates account.
4. User can access system.

---

# UCS-12 Authorization Management

## Use Case Name

Manage User Permission

## Actors

- System Administrator

---

## Main Flow

1. Administrator assigns role.
2. Administrator assigns factory access.
3. System updates permissions.

---

## Business Rules

- Authorization is managed at Factory level.

---

# UCS-13 Dashboard Monitoring

## Use Case Name

View Operational Dashboard

## Actors

- Factory Manager
- Director
- Operator

---

## Main Flow

1. User opens dashboard.
2. System loads operational data.
3. System displays machine status.
4. System displays alerts and KPIs.

---

# UCS-14 Reporting

## Use Case Name

Generate Reports

## Actors

- Factory Manager
- Director

---

## Main Flow

1. User selects report type.
2. User selects filters.
3. System generates report.
4. User exports report.

---

## Supported Formats

- PDF
- Excel

---

# UCS-15 Audit Log Management

## Use Case Name

View Audit Logs

## Actors

- System Administrator

---

## Main Flow

1. Administrator accesses audit logs.
2. System displays recorded activities.
3. User filters logs.

---

## Business Rules

- Security-related activities must be recorded.
- Audit records cannot be modified.

---

# Revision History

| Version | Date | Author | Description |
| ------- | ---- | ------ | ----------- |
| 1.0 | 2026-08-07 | Business Analyst | Initial version |