# UCS-06. Production Line Management

**Document Name:** Use Case Specification  
**Use Case ID:** UCS-06  
**Use Case Name:** Production Line Management  
**Project:** Factory Management System (FMS)  
**Version:** 1.0  
**Status:** Draft  

---

# 1. Use Case Overview

## 1.1 Description

The **Production Line Management** use case describes how the system manages production lines within workshops.

A Production Line represents a group of machines organized to perform manufacturing operations within a Workshop.

The system allows authorized users to create, update, activate, deactivate, and view production line information.

Production Line Management provides the organizational foundation for:

- Machine assignment.
- Machine monitoring.
- Operational reporting.
- Factory hierarchy management.

---

# 2. Actors

| Actor | Description |
| --- | --- |
| System Administrator | Manages production line information and configuration |
| Factory Manager | Manages production lines within assigned factories |
| Production Supervisor | Views and manages production line operations |

---

# 3. Use Case Scope

This use case covers:

- Create Production Line.
- View Production Line details.
- Update Production Line information.
- Activate Production Line.
- Deactivate Production Line.
- Search Production Line.
- Filter Production Line.
- View Production Line hierarchy.

This use case does not cover:

- Workshop Management.
- Machine Management.
- Production execution.
- Production scheduling.

Related use cases:

- UCS-05 Workshop Management.
- UCS-07 Machine Management.

---

# 4. Preconditions

Before executing this use case:

1. User must have Production Line Management permission.
2. Parent Workshop must already exist.
3. Workshop must be active.
4. System must be available.

---

# 5. Trigger

The use case is triggered when:

- A new production line is created.
- Production line information needs updating.
- Production line status changes.
- Users need to view production line information.

---

# 6. Main Success Flow

## 6.1 Create Production Line

| Step | Actor Action | System Response |
| --- | --- | --- |
| 1 | User opens Production Line Management | System displays production line list |
| 2 | User selects Create Production Line | System displays creation form |
| 3 | User selects Workshop | System loads available workshops |
| 4 | User enters production line information | System validates input data |
| 5 | User submits creation request | System checks duplicate information |
| 6 | System creates Production Line | Production line is stored |
| 7 | System links Production Line to Workshop | Organization hierarchy is updated |
| 8 | System records audit log | Creation activity is stored |
| 9 | System displays success message | Production line becomes available |

---

## 6.2 View Production Line Information

| Step | Actor Action | System Response |
| --- | --- | --- |
| 1 | User selects production line | System retrieves information |
| 2 | User views details | System displays production line data |

Displayed information includes:

- Production Line Code.
- Production Line Name.
- Parent Workshop.
- Description.
- Location.
- Status.
- Machine count.
- Created Date.
- Updated Date.

---

## 6.3 Update Production Line Information

| Step | Actor Action | System Response |
| --- | --- | --- |
| 1 | User selects production line | System displays details |
| 2 | User modifies information | System validates changes |
| 3 | User submits update request | System updates information |
| 4 | System records audit log | Modification history is stored |

---

## 6.4 Activate Production Line

| Step | Actor Action | System Response |
| --- | --- | --- |
| 1 | User selects inactive production line | System displays status |
| 2 | User activates production line | System validates workshop status |
| 3 | System changes status to Active | Production line becomes operational |
| 4 | System records audit log | Status change is stored |

---

## 6.5 Deactivate Production Line

| Step | Actor Action | System Response |
| --- | --- | --- |
| 1 | User selects active production line | System displays information |
| 2 | User requests deactivation | System checks dependencies |
| 3 | System changes status to Inactive | Production line cannot receive new assignments |
| 4 | System records audit log | Status change is stored |

---

# 7. Alternative Flows

## AF-01 Duplicate Production Line Code

### Condition

Production Line Code already exists.

Flow:

| Step | Actor Action | System Response |
| --- | --- | --- |
| 1 | User submits information | System validates uniqueness |
| 2 | Duplicate detected | System rejects request |
| 3 | System displays validation message | User updates data |

---

## AF-02 Invalid Workshop Assignment

### Condition

Selected Workshop does not exist or is inactive.

Flow:

| Step | Actor Action | System Response |
| --- | --- | --- |
| 1 | User selects Workshop | System validates workshop |
| 2 | Workshop is invalid | System rejects creation |
| 3 | System requests valid Workshop | User selects another Workshop |

---

## AF-03 Deactivate Production Line With Active Machines

### Condition

Production Line contains active machines.

Flow:

| Step | Actor Action | System Response |
| --- | --- | --- |
| 1 | User requests deactivation | System checks machine assignments |
| 2 | Active machines detected | System displays warning |
| 3 | User confirms action | System changes status |
| 4 | Historical machine data remains unchanged | Operation completes |

---

# 8. Exception Flows

## EF-01 Database Failure

### Condition

System cannot save production line information.

Flow:

| Step | Actor Action | System Response |
| --- | --- | --- |
| 1 | User submits request | System processes transaction |
| 2 | Database failure occurs | Transaction rollback |
| 3 | System logs error | User receives failure message |

---

## EF-02 Unauthorized Access

### Condition

User does not have Production Line Management permission.

Flow:

| Step | Actor Action | System Response |
| --- | --- | --- |
| 1 | User accesses Production Line Management | System checks permission |
| 2 | Permission denied | Operation is blocked |
| 3 | Security event is recorded | Access rejected |

---

# 9. Business Rules

## BR-PL-001 Production Line Ownership

Each Production Line must belong to exactly one Workshop.

Example:

```text
Factory A
 └── Workshop Assembly

        ├── Production Line A
        ├── Production Line B
        └── Production Line C
````

---

## BR-PL-002 Production Line Code Uniqueness

Each Production Line must have a unique code.

---

## BR-PL-003 Production Line Status

Production Line status includes:

```
Active
Inactive
```

---

## BR-PL-004 Machine Assignment Dependency

A Machine can only be assigned to an active Production Line.

---

## BR-PL-005 Historical Data Preservation

Deactivating a Production Line must not remove:

* Machine assignment history.
* Telemetry history.
* Maintenance history.
* Incident history.

---

## BR-PL-006 Workshop Dependency

A Production Line can only exist under an active Workshop.

---

# 10. Data Requirements

## Production Line Entity

| Field                | Description                 |
| -------------------- | --------------------------- |
| Production Line ID   | Unique identifier           |
| Workshop ID          | Parent workshop identifier  |
| Production Line Code | Unique production line code |
| Production Line Name | Production line name        |
| Description          | Production line description |
| Location             | Physical location           |
| Status               | Active / Inactive           |
| Created Date         | Creation timestamp          |
| Updated Date         | Last modification timestamp |

---

# 11. Input Requirements

| Input                | Required |
| -------------------- | -------- |
| Workshop ID          | Yes      |
| Production Line Code | Yes      |
| Production Line Name | Yes      |
| Description          | No       |
| Location             | No       |
| Status               | Yes      |

---

# 12. Output Requirements

The system provides:

* Production Line list.
* Production Line details.
* Workshop hierarchy.
* Machine count.
* Operation result messages.

---

# 13. Postconditions

## Successful Execution

After completion:

* Production Line is created or updated.
* Production Line remains linked to correct Workshop.
* Audit record is generated.

---

## Failed Execution

After failure:

* Production Line data remains unchanged.
* Error information is returned.
* Failure is logged.

---

# 14. Acceptance Criteria

## AC-01 Create Production Line

Given:

* An active Workshop exists.

When:

* User creates a valid Production Line.

Then:

* Production Line is created successfully.
* Production Line belongs to selected Workshop.

---

## AC-02 Update Production Line

Given:

* Production Line exists.

When:

* User updates information.

Then:

* Information is updated.
* Audit log is generated.

---

## AC-03 Deactivate Production Line

Given:

* Production Line exists.

When:

* User deactivates it.

Then:

* Status changes to Inactive.
* Historical data remains available.

---

## AC-04 Production Line Hierarchy

Given:

* Production Line belongs to Workshop.

When:

* User views organization hierarchy.

Then:

* Production Line appears under correct Workshop.

---

## AC-05 Permission Control

Given:

* User does not have permission.

When:

* User accesses Production Line Management.

Then:

* System denies access.

---

# 15. Related Requirements

| Requirement                | Reference |
| -------------------------- | --------- |
| Organization Management    | FR-01     |
| Production Line Management | FR-04     |
| Workshop Management        | UCS-05    |
| Machine Management         | UCS-07    |
| Authorization              | FR-09     |
| Audit Log                  | FR-12     |

---

# Revision History

| Version | Date       | Author           | Description     |
| ------- | ---------- | ---------------- | --------------- |
| 1.0     | 2026-08-07 | Business Analyst | Initial version |
