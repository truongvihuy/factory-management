# UCS-07. Machine Management

**Document Name:** Use Case Specification  
**Use Case ID:** UCS-07  
**Use Case Name:** Machine Management  
**Project:** Factory Management System (FMS)  
**Version:** 1.0  
**Status:** Draft  

---

# 1. Use Case Overview

## 1.1 Description

The **Machine Management** use case describes how the system manages industrial machines throughout their operational lifecycle.

A Machine represents a physical industrial asset that belongs to a Production Line and is monitored by the Factory Management System.

The system allows authorized users to register, update, view, assign, relocate, activate, deactivate, and manage machine information.

Machine Management provides the foundation for:

- Real-time machine monitoring.
- Telemetry collection.
- Alert generation.
- Maintenance activities.
- Incident tracking.
- Operational reporting.

---

# 2. Actors

| Actor | Description |
| --- | --- |
| System Administrator | Manages machine information and configuration |
| Factory Manager | Manages machines within assigned factories |
| Production Supervisor | Views and manages machines within production lines |
| Maintenance Engineer | Views machine information for maintenance activities |
| Operator | Monitors assigned machines |

---

# 3. Use Case Scope

This use case covers:

- Register Machine.
- View Machine information.
- Update Machine information.
- Activate Machine.
- Deactivate Machine.
- Assign Machine to Production Line.
- Move Machine between Production Lines.
- View Machine assignment history.
- Search Machine.
- Filter Machine.
- View Machine operational information.

This use case does not cover:

- Sensor Management.
- Telemetry Collection.
- Alert Management.
- Maintenance execution.
- Incident resolution.

Related use cases:

- UCS-06 Production Line Management.
- UCS-08 Sensor Management.
- UCS-09 Telemetry Management.
- UCS-10 Alert Management.
- UCS-12 Maintenance Management.
- UCS-13 Incident Management.

---

# 4. Preconditions

Before executing this use case:

1. User must have Machine Management permission.
2. Factory must exist and be active.
3. Workshop must exist and be active.
4. Production Line must exist and be active.
5. System must be available.

---

# 5. Trigger

The use case is triggered when:

- A new machine is installed.
- Machine information needs updating.
- Machine assignment changes.
- Users need machine operational information.
- Machine lifecycle status changes.

---

# 6. Main Success Flow

# 6.1 Register Machine

| Step | Actor Action | System Response |
| --- | --- | --- |
| 1 | User opens Machine Management | System displays machine list |
| 2 | User selects Create Machine | System displays machine registration form |
| 3 | User enters machine information | System validates input |
| 4 | User selects Production Line | System validates production line |
| 5 | User submits request | System checks duplicate machine |
| 6 | System creates machine record | Machine information is stored |
| 7 | System assigns machine to Production Line | Relationship is created |
| 8 | System records audit log | Creation activity is stored |
| 9 | System displays success message | Machine becomes available |

---

# 6.2 View Machine Information

| Step | Actor Action | System Response |
| --- | --- | --- |
| 1 | User selects machine | System retrieves machine information |
| 2 | User views details | System displays machine data |

Displayed information includes:

- Machine Code.
- Machine Name.
- Machine Type.
- Model.
- Serial Number.
- Manufacturer.
- Factory.
- Workshop.
- Production Line.
- Installation Date.
- Warranty Expiry Date.
- Status.
- Running Hours.
- Last Maintenance.
- Next Maintenance.

---

# 6.3 Update Machine Information

| Step | Actor Action | System Response |
| --- | --- | --- |
| 1 | User selects machine | System displays details |
| 2 | User modifies information | System validates changes |
| 3 | User submits update | System updates machine information |
| 4 | System records audit log | Modification history is stored |

---

# 6.4 Assign Machine To Production Line

| Step | Actor Action | System Response |
| --- | --- | --- |
| 1 | User selects unassigned machine | System displays available production lines |
| 2 | User selects production line | System validates assignment |
| 3 | User confirms assignment | System creates assignment record |
| 4 | System updates machine location | Machine becomes part of production line |
| 5 | System records history | Assignment history is stored |

---

# 6.5 Move Machine Between Production Lines

| Step | Actor Action | System Response |
| --- | --- | --- |
| 1 | User selects existing machine | System displays current assignment |
| 2 | User selects new production line | System validates new assignment |
| 3 | User confirms relocation | System closes previous assignment |
| 4 | System creates new assignment | Machine location is updated |
| 5 | System preserves history | Previous assignment remains available |
| 6 | System records audit log | Change is tracked |

---

# 6.6 Activate Machine

| Step | Actor Action | System Response |
| --- | --- | --- |
| 1 | User selects inactive machine | System displays machine status |
| 2 | User activates machine | System validates conditions |
| 3 | System changes status to Active | Machine becomes operational |
| 4 | System records audit log | Status change stored |

---

# 6.7 Deactivate Machine

| Step | Actor Action | System Response |
| --- | --- | --- |
| 1 | User selects active machine | System displays machine details |
| 2 | User requests deactivation | System validates dependencies |
| 3 | System changes status | Machine becomes inactive |
| 4 | System keeps historical data | Data remains available |
| 5 | System records audit log | Status change stored |

---

# 7. Alternative Flows

## AF-01 Duplicate Machine Code

### Condition

Machine Code already exists.

Flow:

| Step | Actor Action | System Response |
| --- | --- | --- |
| 1 | User submits machine information | System validates uniqueness |
| 2 | Duplicate detected | System rejects request |
| 3 | System displays validation error | User updates information |

---

## AF-02 Invalid Production Line

### Condition

Selected Production Line does not exist or is inactive.

Flow:

| Step | Actor Action | System Response |
| --- | --- | --- |
| 1 | User selects Production Line | System validates status |
| 2 | Invalid Production Line detected | Assignment rejected |
| 3 | System requests another selection | User retries |

---

## AF-03 Machine Relocation Conflict

### Condition

Machine already has an active assignment.

Flow:

| Step | Actor Action | System Response |
| --- | --- | --- |
| 1 | User requests relocation | System checks current assignment |
| 2 | Active assignment found | System closes previous assignment |
| 3 | New assignment created | History preserved |

---

# 8. Exception Flows

## EF-01 Database Failure

### Condition

System cannot store machine information.

Flow:

| Step | Actor Action | System Response |
| --- | --- | --- |
| 1 | User submits request | System processes transaction |
| 2 | Database error occurs | Transaction rollback |
| 3 | System logs error | User receives failure message |

---

## EF-02 Unauthorized Access

### Condition

User does not have Machine Management permission.

Flow:

| Step | Actor Action | System Response |
| --- | --- | --- |
| 1 | User accesses machine module | System validates permission |
| 2 | Permission denied | Operation blocked |
| 3 | Security event recorded | Access rejected |

---

# 9. Business Rules

## BR-MC-001 Machine Ownership

A Machine must belong to exactly one Production Line at any point in time.

Example:

```text
Factory A

 └── Workshop Assembly

      └── Production Line 01

            ├── Machine A
            ├── Machine B
            └── Machine C
````

---

## BR-MC-002 Machine Code Uniqueness

Each Machine must have a unique machine code.

---

## BR-MC-003 Machine Assignment History

When a Machine moves:

* Previous assignment must be preserved.
* New assignment must be created.
* Historical telemetry remains unchanged.

---

## BR-MC-004 Machine Lifecycle Status

Machine status includes:

```text
Draft
Installed
Running
Idle
Maintenance
Offline
Error
Retired
```

---

## BR-MC-005 Historical Data Preservation

Machine deactivation must not remove:

* Telemetry history.
* Maintenance history.
* Incident history.
* Assignment history.

---

## BR-MC-006 Production Line Dependency

A Machine can only be assigned to an active Production Line.

---

# 10. Data Requirements

## Machine Entity

| Field              | Description                |
| ------------------ | -------------------------- |
| Machine ID         | Unique identifier          |
| Production Line ID | Current production line    |
| Machine Code       | Unique machine identifier  |
| Machine Name       | Machine name               |
| Machine Type       | Machine category           |
| Model              | Machine model              |
| Serial Number      | Manufacturer serial number |
| Manufacturer       | Machine manufacturer       |
| Installation Date  | Installation date          |
| Warranty Expiry    | Warranty expiration        |
| Running Hours      | Current operating hours    |
| Status             | Current machine status     |
| Created Date       | Creation timestamp         |
| Updated Date       | Last update timestamp      |

---

## Machine Assignment History

| Field              | Description                |
| ------------------ | -------------------------- |
| Assignment ID      | Unique identifier          |
| Machine ID         | Machine reference          |
| Production Line ID | Assigned production line   |
| Start Date         | Assignment start           |
| End Date           | Assignment end             |
| Created By         | User performing assignment |

---

# 11. Input Requirements

| Input              | Required |
| ------------------ | -------- |
| Machine Code       | Yes      |
| Machine Name       | Yes      |
| Machine Type       | Yes      |
| Production Line ID | Yes      |
| Manufacturer       | No       |
| Model              | No       |
| Serial Number      | No       |
| Installation Date  | No       |
| Warranty Expiry    | No       |
| Status             | Yes      |

---

# 12. Output Requirements

The system provides:

* Machine list.
* Machine details.
* Machine assignment history.
* Machine status.
* Machine operational information.

---

# 13. Postconditions

## Successful Execution

After completion:

* Machine information is stored.
* Machine belongs to correct Production Line.
* Assignment history is maintained.
* Audit log is generated.

---

## Failed Execution

After failure:

* Machine data remains unchanged.
* Transaction is rolled back.
* Error is recorded.

---

# 14. Acceptance Criteria

## AC-01 Register Machine

Given:

* Active Production Line exists.

When:

* User creates valid Machine information.

Then:

* Machine is created successfully.
* Machine is assigned to Production Line.

---

## AC-02 Update Machine

Given:

* Machine exists.

When:

* User updates machine information.

Then:

* Information is updated.
* Audit log is generated.

---

## AC-03 Move Machine

Given:

* Machine belongs to a Production Line.

When:

* User moves Machine.

Then:

* Previous assignment is preserved.
* New assignment is created.

---

## AC-04 Machine Lifecycle

Given:

* Machine exists.

When:

* Status changes.

Then:

* New status is recorded.
* Historical data remains available.

---

## AC-05 Permission Control

Given:

* User lacks permission.

When:

* User accesses Machine Management.

Then:

* System denies access.

---

# 15. Related Requirements

| Requirement                | Reference |
| -------------------------- | --------- |
| Production Line Management | UCS-06    |
| Machine Management         | FR-05     |
| Sensor Management          | UCS-08    |
| Telemetry Management       | UCS-09    |
| Alert Management           | UCS-10    |
| Maintenance Management     | UCS-12    |
| Incident Management        | UCS-13    |
| Authorization              | FR-09     |
| Audit Log                  | FR-12     |

---

# Revision History

| Version | Date       | Author           | Description     |
| ------- | ---------- | ---------------- | --------------- |
| 1.0     | 2026-08-07 | Business Analyst | Initial version |