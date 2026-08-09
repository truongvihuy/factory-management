# UCS-08. Sensor Management

**Document Name:** Use Case Specification  
**Use Case ID:** UCS-08  
**Use Case Name:** Sensor Management  
**Project:** Factory Management System (FMS)  
**Version:** 1.0  
**Status:** Draft

---

# 1. Use Case Overview

## 1.1 Description

The **Sensor Management** use case describes how the system manages IoT sensors attached to industrial machines.

A Sensor represents an IoT device responsible for collecting operational data from machines and transmitting telemetry information to the Factory Management System.

The system allows authorized users to register sensors, update sensor information, assign sensors to machines, replace sensors, move sensors between machines, and maintain complete sensor assignment history.

Sensor Management provides the foundation for:

- Telemetry collection.
- Machine monitoring.
- Alert detection.
- Equipment health analysis.
- Operational reporting.

---

# 2. Actors

| Actor                 | Description                                           |
| --------------------- | ----------------------------------------------------- |
| System Administrator  | Manages sensor information and configuration          |
| Factory Manager       | Manages sensors within assigned factories             |
| Production Supervisor | Views sensors assigned to production machines         |
| Maintenance Engineer  | Uses sensor information during maintenance activities |
| Operator              | Monitors sensor status of assigned machines           |

---

# 3. Use Case Scope

This use case covers:

- Register Sensor.
- View Sensor information.
- Update Sensor information.
- Assign Sensor to Machine.
- Replace Sensor.
- Move Sensor between Machines.
- View Sensor assignment history.
- Activate Sensor.
- Deactivate Sensor.
- Search Sensor.
- Filter Sensor.

This use case does not cover:

- Telemetry ingestion.
- Alert generation.
- Machine Management.
- Gateway Management.
- IoT protocol communication.

Related use cases:

- UCS-07 Machine Management.
- UCS-09 Telemetry Management.
- UCS-10 Alert Management.
- UCS-12 Maintenance Management.

---

# 4. Preconditions

Before executing this use case:

1. User must have Sensor Management permission.
2. Factory must exist and be active.
3. Machine must exist and be active.
4. User must have access to the factory containing the machine.
5. System must be available.

---

# 5. Trigger

The use case is triggered when:

- A new sensor is installed.
- A sensor needs replacement.
- A sensor is moved to another machine.
- Sensor information needs updating.
- Users need to review sensor assignment history.

---

# 6. Main Success Flow

# 6.1 Register Sensor

| Step | Actor Action                    | System Response                          |
| ---- | ------------------------------- | ---------------------------------------- |
| 1    | User opens Sensor Management    | System displays sensor list              |
| 2    | User selects Create Sensor      | System displays sensor registration form |
| 3    | User enters sensor information  | System validates input                   |
| 4    | User submits request            | System checks duplicate sensor           |
| 5    | System creates sensor record    | Sensor information is stored             |
| 6    | System records audit log        | Creation activity is stored              |
| 7    | System displays success message | Sensor becomes available                 |

---

# 6.2 View Sensor Information

| Step | Actor Action        | System Response                     |
| ---- | ------------------- | ----------------------------------- |
| 1    | User selects sensor | System retrieves sensor information |
| 2    | User views details  | System displays sensor data         |

Displayed information includes:

- Sensor Code.
- Sensor Name.
- Sensor Type.
- Model.
- Serial Number.
- Manufacturer.
- Sensor Status.
- Assigned Machine.
- Installation Date.
- Last Communication Time.
- Created Date.
- Updated Date.

---

# 6.3 Update Sensor Information

| Step | Actor Action              | System Response                   |
| ---- | ------------------------- | --------------------------------- |
| 1    | User selects sensor       | System displays sensor details    |
| 2    | User modifies information | System validates changes          |
| 3    | User submits update       | System updates sensor information |
| 4    | System records audit log  | Modification history is stored    |

---

# 6.4 Assign Sensor To Machine

| Step | Actor Action                      | System Response                  |
| ---- | --------------------------------- | -------------------------------- |
| 1    | User selects available sensor     | System displays active machines  |
| 2    | User selects machine              | System validates machine         |
| 3    | User confirms assignment          | System creates assignment record |
| 4    | System links sensor with machine  | Sensor becomes active            |
| 5    | System records assignment history | Assignment is stored             |
| 6    | System records audit log          | Change is tracked                |

---

# 6.5 Replace Sensor

| Step | Actor Action                  | System Response                     |
| ---- | ----------------------------- | ----------------------------------- |
| 1    | User selects existing sensor  | System displays current assignment  |
| 2    | User requests replacement     | System validates replacement sensor |
| 3    | User selects new sensor       | System closes old assignment        |
| 4    | System creates new assignment | New sensor is linked to machine     |
| 5    | System preserves history      | Previous sensor assignment remains  |
| 6    | System records audit log      | Replacement activity is stored      |

---

# 6.6 Move Sensor Between Machines

| Step | Actor Action                        | System Response                     |
| ---- | ----------------------------------- | ----------------------------------- |
| 1    | User selects sensor                 | System displays current machine     |
| 2    | User selects new machine            | System validates machine            |
| 3    | User confirms movement              | System closes previous assignment   |
| 4    | System creates new assignment       | Sensor is assigned to new machine   |
| 5    | System preserves assignment history | Historical records remain unchanged |
| 6    | System records audit log            | Movement is tracked                 |

---

# 6.7 Activate Sensor

| Step | Actor Action                 | System Response                    |
| ---- | ---------------------------- | ---------------------------------- |
| 1    | User selects inactive sensor | System displays sensor information |
| 2    | User activates sensor        | System validates conditions        |
| 3    | System changes status        | Sensor becomes active              |
| 4    | System records audit log     | Status change stored               |

---

# 6.8 Deactivate Sensor

| Step | Actor Action                 | System Response                     |
| ---- | ---------------------------- | ----------------------------------- |
| 1    | User selects active sensor   | System displays sensor details      |
| 2    | User requests deactivation   | System validates dependencies       |
| 3    | System changes sensor status | Sensor becomes inactive             |
| 4    | System keeps historical data | Telemetry history remains available |
| 5    | System records audit log     | Status change stored                |

---

# 7. Alternative Flows

## AF-01 Duplicate Sensor Code

### Condition

Sensor Code already exists.

Flow:

| Step | Actor Action                     | System Response             |
| ---- | -------------------------------- | --------------------------- |
| 1    | User submits sensor information  | System validates uniqueness |
| 2    | Duplicate detected               | System rejects request      |
| 3    | System displays validation error | User updates information    |

---

## AF-02 Sensor Already Assigned

### Condition

Sensor already belongs to another Machine.

Flow:

| Step | Actor Action                              | System Response                      |
| ---- | ----------------------------------------- | ------------------------------------ |
| 1    | User assigns sensor                       | System checks current assignment     |
| 2    | Active assignment exists                  | System prevents duplicate assignment |
| 3    | User must perform replacement or movement | Operation rejected                   |

---

## AF-03 Invalid Machine Assignment

### Condition

Selected Machine is inactive.

Flow:

| Step | Actor Action                   | System Response                 |
| ---- | ------------------------------ | ------------------------------- |
| 1    | User selects machine           | System validates machine status |
| 2    | Machine inactive               | Assignment rejected             |
| 3    | System requests active machine | User retries                    |

---

# 8. Exception Flows

## EF-01 Database Failure

### Condition

System cannot store sensor information.

Flow:

| Step | Actor Action          | System Response               |
| ---- | --------------------- | ----------------------------- |
| 1    | User submits request  | System processes transaction  |
| 2    | Database error occurs | Transaction rollback          |
| 3    | System records error  | User receives failure message |

---

## EF-02 Unauthorized Access

### Condition

User does not have Sensor Management permission.

Flow:

| Step | Actor Action                | System Response             |
| ---- | --------------------------- | --------------------------- |
| 1    | User accesses sensor module | System validates permission |
| 2    | Permission denied           | Operation blocked           |
| 3    | Security event recorded     | Access rejected             |

---

# 9. Business Rules

## BR-SN-001 Sensor Ownership

A Sensor belongs to only one Machine at any point in time.

Example:

```text
Machine A
 ├── Temperature Sensor
 ├── Vibration Sensor
 └── Pressure Sensor
```

---

## BR-SN-002 Sensor Code Uniqueness

Each Sensor must have a unique sensor code.

---

## BR-SN-003 Sensor Assignment History

When a Sensor is moved:

- Previous assignment must be preserved.
- New assignment must be created.
- Historical telemetry remains unchanged.

---

## BR-SN-004 Sensor Replacement

When replacing a Sensor:

- Old sensor assignment is closed.
- New sensor assignment is created.
- Historical telemetry remains linked to the original sensor and machine.

---

## BR-SN-005 Sensor Lifecycle Status

Sensor status includes:

```text
Draft
Installed
Active
Inactive
Maintenance
Retired
```

---

## BR-SN-006 Historical Data Preservation

Sensor deactivation must not remove:

- Telemetry history.
- Assignment history.
- Maintenance references.

---

## BR-SN-007 Machine Dependency

A Sensor can only be assigned to an existing active Machine.

---

# 10. Data Requirements

## Sensor Entity

| Field             | Description                |
| ----------------- | -------------------------- |
| Sensor ID         | Unique identifier          |
| Sensor Code       | Unique sensor identifier   |
| Sensor Name       | Sensor name                |
| Sensor Type       | Sensor category            |
| Model             | Sensor model               |
| Serial Number     | Manufacturer serial number |
| Manufacturer      | Sensor manufacturer        |
| Status            | Current sensor status      |
| Installation Date | Installation date          |
| Created Date      | Creation timestamp         |
| Updated Date      | Last update timestamp      |

---

## Sensor Assignment History

| Field         | Description                |
| ------------- | -------------------------- |
| Assignment ID | Unique identifier          |
| Sensor ID     | Sensor reference           |
| Machine ID    | Assigned machine           |
| Start Date    | Assignment start           |
| End Date      | Assignment end             |
| Created By    | User performing assignment |

---

# 11. Input Requirements

| Input             | Required |
| ----------------- | -------- |
| Sensor Code       | Yes      |
| Sensor Name       | Yes      |
| Sensor Type       | Yes      |
| Machine ID        | No       |
| Manufacturer      | No       |
| Model             | No       |
| Serial Number     | No       |
| Installation Date | No       |
| Status            | Yes      |

---

# 12. Output Requirements

The system provides:

- Sensor list.
- Sensor details.
- Sensor assignment information.
- Sensor assignment history.
- Sensor status.

---

# 13. Postconditions

## Successful Execution

After completion:

- Sensor information is stored.
- Sensor assignment is created correctly.
- Assignment history is maintained.
- Audit log is generated.

---

## Failed Execution

After failure:

- Sensor data remains unchanged.
- Transaction is rolled back.
- Error is recorded.

---

# 14. Acceptance Criteria

## AC-01 Register Sensor

Given:

- User has permission.
- Sensor information is valid.

When:

- User creates a sensor.

Then:

- Sensor is created successfully.
- Sensor becomes available.

---

## AC-02 Assign Sensor

Given:

- Active Machine exists.

When:

- User assigns sensor.

Then:

- Sensor is linked to Machine.
- Assignment history is created.

---

## AC-03 Move Sensor

Given:

- Sensor belongs to a Machine.

When:

- User moves sensor.

Then:

- Previous assignment is preserved.
- New assignment is created.

---

## AC-04 Replace Sensor

Given:

- Existing sensor is installed.

When:

- User replaces sensor.

Then:

- Old assignment is closed.
- New sensor becomes active.

---

## AC-05 Permission Control

Given:

- User lacks permission.

When:

- User accesses Sensor Management.

Then:

- System denies access.

---

# 15. Related Requirements

| Requirement            | Reference |
| ---------------------- | --------- |
| Machine Management     | UCS-07    |
| Telemetry Management   | UCS-09    |
| Alert Management       | UCS-10    |
| Maintenance Management | UCS-12    |
| Authorization          | FR-09     |
| Audit Log              | FR-12     |

---

# Revision History

| Version | Date       | Author           | Description     |
| ------- | ---------- | ---------------- | --------------- |
| 1.0     | 2026-08-07 | Business Analyst | Initial version |
