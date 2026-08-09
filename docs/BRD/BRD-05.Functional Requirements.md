# BRD-05. Functional Requirements

**Document Name:** Business Requirements Document (BRD)  
**Section:** BRD-05 Functional Requirements  
**Project:** Factory Management System (FMS)

---

# 5. Functional Requirements

## 5.1 Overview

This document defines the functional capabilities required for the Factory Management System (FMS).

Each functional requirement describes **what the system shall do** from a business perspective without specifying implementation details.

---

# 5.2 Functional Modules

| Module ID | Module                  |
| --------- | ----------------------- |
| FR-01     | Organization Management |
| FR-02     | Machine Management      |
| FR-03     | Sensor Management       |
| FR-04     | Telemetry Management    |
| FR-05     | Alert Management        |
| FR-06     | Maintenance Management  |
| FR-07     | Incident Management     |
| FR-08     | User Management         |
| FR-09     | Authorization           |
| FR-10     | Dashboard               |
| FR-11     | Reporting               |
| FR-12     | Audit Log               |

---

# FR-01 Organization Management

## Objective

Manage organizational hierarchy.

## Functional Requirements

### FR-01-01

The system shall manage multiple Companies.

### FR-01-02

The system shall manage multiple Factories under each Company.

### FR-01-03

The system shall manage multiple Workshops within each Factory.

### FR-01-04

The system shall manage multiple Production Lines within each Workshop.

### FR-01-05

The system shall allow activation and deactivation of organizational entities.

---

# FR-02 Machine Management

## Objective

Manage industrial machines throughout their lifecycle.

## Functional Requirements

### FR-02-01

Register a Machine.

### FR-02-02

Update Machine information.

### FR-02-03

Deactivate a Machine.

### FR-02-04

View Machine details.

### FR-02-05

Search Machines.

### FR-02-06

Filter Machines.

### FR-02-07

Assign a Machine to a Production Line.

### FR-02-08

Move a Machine to another Production Line.

### FR-02-09

Maintain Machine assignment history.

### FR-02-10

View Machine maintenance history.

### FR-02-11

View Machine incident history.

### FR-02-12

View Machine telemetry history.

---

# FR-03 Sensor Management

## Objective

Manage IoT sensors.

## Functional Requirements

### FR-03-01

Register Sensors.

### FR-03-02

Update Sensor information.

### FR-03-03

Assign Sensor to Machine.

### FR-03-04

Replace Sensor.

### FR-03-05

Move Sensor to another Machine.

### FR-03-06

Maintain Sensor assignment history.

### FR-03-07

View Sensor assignment history.

---

# FR-04 Telemetry Management

## Objective

Collect and manage telemetry.

## Functional Requirements

### FR-04-01

Receive telemetry from IoT devices.

### FR-04-02

Validate incoming telemetry.

### FR-04-03

Store telemetry.

### FR-04-04

Display telemetry in near real time.

### FR-04-05

View telemetry history.

### FR-04-06

Archive historical telemetry.

### FR-04-07

Search archived telemetry.

---

# FR-05 Alert Management

## Objective

Manage abnormal machine conditions.

## Functional Requirements

### FR-05-01

Configure alert thresholds.

### FR-05-02

Evaluate telemetry against configured thresholds.

### FR-05-03

Generate alerts.

### FR-05-04

Assign alert severity.

### FR-05-05

Send notifications.

### FR-05-06

Allow users to acknowledge alerts.

### FR-05-07

Escalate unresolved alerts.

### FR-05-08

Close alerts.

### FR-05-09

Maintain alert history.

---

# FR-06 Maintenance Management

## Objective

Manage maintenance activities.

## Functional Requirements

### FR-06-01

Create maintenance schedules.

### FR-06-02

Approve maintenance schedules.

### FR-06-03

Generate Work Orders.

### FR-06-04

Assign maintenance engineers.

### FR-06-05

Execute maintenance.

### FR-06-06

Complete maintenance checklist.

### FR-06-07

Record spare parts.

### FR-06-08

Record maintenance cost.

### FR-06-09

Close Work Orders.

### FR-06-10

Maintain maintenance history.

---

# FR-07 Incident Management

## Objective

Manage operational incidents.

## Functional Requirements

### FR-07-01

Create Incidents.

### FR-07-02

Assign Incidents.

### FR-07-03

Update Incident status.

### FR-07-04

Track SLA.

### FR-07-05

Verify Incident resolution.

### FR-07-06

Close Incidents.

### FR-07-07

Link related Incidents into a Major Incident.

### FR-07-08

Maintain Incident history.

---

# FR-08 User Management

## Objective

Manage user accounts.

## Functional Requirements

### FR-08-01

Create Users.

### FR-08-02

Update Users.

### FR-08-03

Deactivate Users.

### FR-08-04

Reset Password.

### FR-08-05

Change Password.

### FR-08-06

Lock User Account.

### FR-08-07

Unlock User Account.

---

# FR-09 Authorization

## Objective

Manage user permissions.

## Functional Requirements

### FR-09-01

Assign Roles.

### FR-09-02

Assign Users to multiple Factories.

### FR-09-03

Restrict access by Factory.

### FR-09-04

Grant permissions.

### FR-09-05

Revoke permissions.

---

# FR-10 Dashboard

## Objective

Provide operational visibility.

## Functional Requirements

### FR-10-01

Display machine status.

### FR-10-02

Display active alerts.

### FR-10-03

Display maintenance summary.

### FR-10-04

Display incident summary.

### FR-10-05

Display KPI overview.

### FR-10-06

Display energy consumption.

---

# FR-11 Reporting

## Objective

Generate operational reports.

## Functional Requirements

### FR-11-01

Generate Machine Status Report.

### FR-11-02

Generate Maintenance Report.

### FR-11-03

Generate Incident Report.

### FR-11-04

Generate Energy Consumption Report.

### FR-11-05

Generate KPI Dashboard.

### FR-11-06

Export reports to PDF.

### FR-11-07

Export reports to Excel.

---

# FR-12 Audit Log

## Objective

Track system activities.

## Functional Requirements

### FR-12-01

Record user login.

### FR-12-02

Record user logout.

### FR-12-03

Record entity creation.

### FR-12-04

Record entity update.

### FR-12-05

Record entity deletion.

### FR-12-06

Record permission changes.

### FR-12-07

Record configuration changes.

---

# 5.3 Functional Requirement Traceability

| Business Goal             | Functional Modules         |
| ------------------------- | -------------------------- |
| Reduce Downtime           | FR-04, FR-05, FR-06, FR-07 |
| Improve Monitoring        | FR-02, FR-03, FR-04, FR-10 |
| Improve Maintenance       | FR-06                      |
| Improve Incident Response | FR-05, FR-07               |
| Operational Reporting     | FR-10, FR-11               |
| Secure Access             | FR-08, FR-09, FR-12        |

---

# 5.4 Functional Assumptions

- Users authenticate using Local Accounts.
- Authorization is enforced at the Factory level.
- Historical telemetry is immutable.
- Historical assignment records cannot be deleted.
- One Machine belongs to one Production Line at any point in time.
- One Sensor belongs to one Machine at any point in time.
- Archived telemetry remains searchable.

---

# 5.5 Functional Constraints

- Production Management is outside the MVP scope.
- Manufacturing workflows are not supported.
- ERP integration is not included.
- Warehouse management is excluded.
- Financial management is excluded.
