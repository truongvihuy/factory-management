# SRS-05. Data Requirements

**Document Name:** Software Requirements Specification (SRS)  
**Section:** SRS-05 Data Requirements  
**Project:** Factory Management System (FMS)  
**Version:** 1.0  
**Status:** Draft

---

# 5. Data Requirements

## 5.1 Overview

This document defines the data requirements for the **Factory Management System (FMS)**.

The purpose of this section is to describe:

- Data entities managed by the system.
- Data relationships.
- Data ownership.
- Data lifecycle.
- Data validation rules.
- Data retention requirements.

This document focuses on **what data the system shall manage** and does not define database implementation details.

---

# 5.2 Data Management Principles

The system shall follow the following data principles:

## Data Integrity

The system shall ensure:

- Data consistency.
- Data accuracy.
- Data traceability.
- Historical data preservation.

---

## Historical Data Preservation

The system shall preserve historical operational information.

The following data shall not be deleted:

- Machine assignment history.
- Sensor assignment history.
- Telemetry history.
- Maintenance history.
- Incident history.
- Audit history.

---

## Data Ownership

Each business entity shall belong to a defined ownership scope.

Example:

```

Company
|
└── Factory
|
└── Workshop
|
└── Production Line
|
└── Machine
|
└── Sensor
|
└── Telemetry

```

---

# 5.3 Core Data Entities

The Factory Management System manages the following major data entities.

| Entity ID | Entity Name             |
| --------- | ----------------------- |
| ENT-01    | Company                 |
| ENT-02    | Factory                 |
| ENT-03    | Workshop                |
| ENT-04    | Production Line         |
| ENT-05    | Machine                 |
| ENT-06    | Sensor                  |
| ENT-07    | Telemetry               |
| ENT-08    | Alert                   |
| ENT-09    | Maintenance             |
| ENT-10    | Incident                |
| ENT-11    | User                    |
| ENT-12    | Role                    |
| ENT-13    | Permission              |
| ENT-14    | Dashboard Configuration |
| ENT-15    | Report                  |
| ENT-16    | Audit Log               |

---

# 5.4 Organization Data Requirements

# ENT-01 Company

## Description

Represents an organization that owns factories.

## Data Attributes

| Attribute    | Description           |
| ------------ | --------------------- |
| Company ID   | Unique identifier     |
| Company Code | Business identifier   |
| Company Name | Company name          |
| Status       | Active / Inactive     |
| Created Date | Creation timestamp    |
| Updated Date | Last update timestamp |

## Relationships

```

Company
|
└── Factory

```

---

# ENT-02 Factory

## Description

Represents a manufacturing facility.

## Data Attributes

| Attribute    | Description           |
| ------------ | --------------------- |
| Factory ID   | Unique identifier     |
| Factory Code | Factory identifier    |
| Factory Name | Factory name          |
| Address      | Factory location      |
| Status       | Active / Inactive     |
| Created Date | Creation timestamp    |
| Updated Date | Last update timestamp |

## Relationships

```

Factory
|
├── Workshop
├── Production Line
└── Machine

```

---

# ENT-03 Workshop

## Description

Represents a production area inside a factory.

## Data Attributes

| Attribute     | Description          |
| ------------- | -------------------- |
| Workshop ID   | Unique identifier    |
| Workshop Code | Workshop identifier  |
| Workshop Name | Workshop name        |
| Description   | Workshop information |
| Status        | Active / Inactive    |

## Relationships

```

Factory
|
└── Workshop

```

---

# ENT-04 Production Line

## Description

Represents a group of machines operating together.

## Data Attributes

| Attribute          | Description                |
| ------------------ | -------------------------- |
| Production Line ID | Unique identifier          |
| Line Code          | Production line identifier |
| Line Name          | Production line name       |
| Status             | Active / Inactive          |

## Relationships

```

Workshop
|
└── Production Line
|
└── Machine

```

---

# 5.5 Asset Data Requirements

# ENT-05 Machine

## Description

Represents an industrial machine monitored by the system.

## Data Attributes

| Attribute         | Description                |
| ----------------- | -------------------------- |
| Machine ID        | Unique identifier          |
| Machine Code      | Machine identifier         |
| Machine Name      | Machine name               |
| Machine Type      | Machine category           |
| Model             | Machine model              |
| Serial Number     | Manufacturer serial number |
| Manufacturer      | Manufacturer information   |
| Installation Date | Installation date          |
| Warranty Expiry   | Warranty date              |
| Status            | Machine operational status |
| Running Hours     | Total operating hours      |
| Created Date      | Creation timestamp         |
| Updated Date      | Last update timestamp      |

---

## Machine Status

Supported values:

- Draft
- Installed
- Running
- Idle
- Maintenance
- Offline
- Error
- Retired

---

## Relationships

```

Production Line
|
└── Machine
|
├── Sensor
├── Telemetry
├── Alert
├── Maintenance
└── Incident

```

---

# ENT-06 Sensor

## Description

Represents an IoT device attached to a machine.

## Data Attributes

| Attribute         | Description            |
| ----------------- | ---------------------- |
| Sensor ID         | Unique identifier      |
| Sensor Code       | Sensor identifier      |
| Sensor Type       | Sensor category        |
| Serial Number     | Sensor serial number   |
| Protocol          | Communication protocol |
| Status            | Sensor status          |
| Installation Date | Installation date      |
| Created Date      | Creation timestamp     |

---

## Supported Protocols

- MQTT
- OPC-UA
- Modbus TCP

---

## Relationships

```

Machine
|
└── Sensor
|
└── Telemetry

```

---

# 5.6 Telemetry Data Requirements

# ENT-07 Telemetry

## Description

Represents operational data collected from machines.

---

## Data Attributes

| Attribute    | Description       |
| ------------ | ----------------- |
| Telemetry ID | Unique identifier |
| Machine ID   | Related machine   |
| Sensor ID    | Source sensor     |
| Timestamp    | Collection time   |
| Data Type    | Metric type       |
| Value        | Measurement value |
| Unit         | Measurement unit  |

---

## Telemetry Data Types

Examples:

- Temperature
- Vibration
- Pressure
- Humidity
- Speed
- Current
- Voltage
- Power
- Energy Consumption
- Machine Status

---

## Data Rules

- Telemetry is append-only.
- Telemetry cannot be updated.
- Telemetry cannot be deleted during retention period.
- Historical telemetry remains associated with original machine.

---

# 5.7 Alert Data Requirements

# ENT-08 Alert

## Description

Represents abnormal machine conditions.

---

## Data Attributes

| Attribute     | Description         |
| ------------- | ------------------- |
| Alert ID      | Unique identifier   |
| Machine ID    | Related machine     |
| Alert Type    | Alert category      |
| Severity      | Alert level         |
| Message       | Alert description   |
| Status        | Alert status        |
| Created Time  | Alert creation time |
| Resolved Time | Resolution time     |

---

## Alert Severity

- Info
- Warning
- Critical

---

# 5.8 Maintenance Data Requirements

# ENT-09 Maintenance

## Description

Represents machine maintenance activities.

---

## Data Attributes

| Attribute         | Description                          |
| ----------------- | ------------------------------------ |
| Maintenance ID    | Unique identifier                    |
| Machine ID        | Related machine                      |
| Maintenance Type  | Preventive / Corrective / Predictive |
| Planned Date      | Scheduled date                       |
| Assigned Engineer | Responsible person                   |
| Status            | Maintenance status                   |
| Completion Date   | Completed date                       |
| Notes             | Maintenance notes                    |

---

## Maintenance Checklist Data

The system shall store:

- Inspection Items.
- Result.
- Technician.
- Notes.
- Attachments.

---

# 5.9 Incident Data Requirements

# ENT-10 Incident

## Description

Represents operational issues requiring investigation.

---

## Data Attributes

| Attribute     | Description               |
| ------------- | ------------------------- |
| Incident ID   | Unique identifier         |
| Machine ID    | Related machine           |
| Title         | Incident title            |
| Description   | Incident details          |
| Priority      | Incident priority         |
| Status        | Incident lifecycle status |
| Assigned User | Responsible person        |
| Created Date  | Creation timestamp        |
| Closed Date   | Closure timestamp         |

---

## Incident Status

- Open
- Assigned
- In Progress
- Resolved
- Verified
- Closed

---

# 5.10 User and Security Data Requirements

# ENT-11 User

## Description

Represents system users.

---

## Data Attributes

| Attribute     | Description        |
| ------------- | ------------------ |
| User ID       | Unique identifier  |
| Username      | Login username     |
| Email         | User email         |
| Password Hash | Encrypted password |
| Status        | Account status     |
| Created Date  | Creation timestamp |

---

# ENT-12 Role

## Description

Defines user roles.

Examples:

- Factory Manager
- Production Supervisor
- Maintenance Engineer
- Operator
- Director
- System Administrator

---

# ENT-13 Permission

## Description

Defines system access permissions.

Examples:

- View Machine.
- Create Machine.
- Update Machine.
- Manage Maintenance.
- Manage Users.

---

# 5.11 Dashboard and Reporting Data Requirements

# ENT-14 Dashboard Configuration

Stores dashboard display configuration.

Data includes:

- Dashboard ID.
- User.
- Factory scope.
- Widget configuration.

---

# ENT-15 Report

Stores generated reports.

Data includes:

- Report ID.
- Report Type.
- Generated User.
- Generated Time.
- Export Format.

---

# 5.12 Audit Data Requirements

# ENT-16 Audit Log

## Description

Records system activities.

---

## Data Attributes

| Attribute | Description            |
| --------- | ---------------------- |
| Audit ID  | Unique identifier      |
| User ID   | User performing action |
| Action    | Activity type          |
| Entity    | Modified object        |
| Old Value | Previous data          |
| New Value | Updated data           |
| Timestamp | Activity time          |

---

# 5.13 Data Retention Requirements

The system shall maintain data according to retention policies.

| Data Type           | Retention |
| ------------------- | --------- |
| Raw Telemetry       | 6 Months  |
| Summary Data        | 5 Years   |
| Maintenance History | Permanent |
| Incident History    | Permanent |
| Audit Log           | Permanent |
| Assignment History  | Permanent |

---

# 5.14 Data Validation Requirements

The system shall validate:

## Mandatory Fields

Required business information must not be empty.

---

## Unique Constraints

The system shall ensure uniqueness of:

- Company Code.
- Factory Code.
- Machine Code.
- Sensor Code.

---

## Referential Integrity

The system shall ensure:

- Machine belongs to existing Production Line.
- Sensor belongs to existing Machine.
- Telemetry belongs to existing Sensor and Machine.
- Maintenance belongs to existing Machine.
- Incident belongs to existing Machine.

---

# 5.15 Data Lifecycle Summary

```text
Create Entity

      ↓

Active Usage

      ↓

Update / Assignment Change

      ↓

Historical Record

      ↓

Archive (Telemetry Only)

      ↓

Long-term Retention
```

---

# Revision History

| Version | Date       | Author           | Description     |
| ------- | ---------- | ---------------- | --------------- |
| 1.0     | 2026-08-07 | Business Analyst | Initial version |
