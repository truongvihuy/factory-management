# UCS-04. Factory Management

**Document Name:** Use Case Specification  
**Use Case ID:** UCS-04  
**Use Case Name:** Factory Management  
**Project:** Factory Management System (FMS)  
**Version:** 1.0  
**Status:** Draft

---

# 1. Use Case Overview

## 1.1 Description

The **Factory Management** use case describes how the system manages manufacturing facilities within a Company.

The system allows authorized users to create, update, activate, deactivate, and view factory information.

Factory Management provides the foundation for:

- Workshop Management.
- Production Line Management.
- Machine Management.
- User authorization by factory scope.
- Factory operational reporting.

A Factory represents a physical manufacturing facility owned by a Company.

---

# 2. Actors

| Actor                | Description                                       |
| -------------------- | ------------------------------------------------- |
| System Administrator | Manages factory information and configuration     |
| Director             | Views factory information for business monitoring |
| Factory Manager      | Manages assigned factory operational information  |

---

# 3. Use Case Scope

This use case covers:

- Create Factory.
- View Factory details.
- Update Factory information.
- Activate Factory.
- Deactivate Factory.
- Search Factory.
- Filter Factory.
- View Factory hierarchy.

This use case does not cover:

- Workshop management.
- Production line management.
- Machine management.
- User authorization assignment.

Those functions are handled by:

- UCS-05 Workshop Management.
- UCS-06 Production Line Management.
- UCS-07 Machine Management.
- Authorization Management.

---

# 4. Preconditions

Before executing this use case:

1. User must have Factory Management permission.
2. Company must already exist.
3. System must be available.
4. Factory information must satisfy validation rules.

---

# 5. Trigger

The use case is triggered when:

- A new factory is established.
- Factory information changes.
- A factory needs to be activated or deactivated.
- Users need to view factory information.

---

# 6. Main Success Flow

## 6.1 Create Factory

| Step | Actor Action                    | System Response                             |
| ---- | ------------------------------- | ------------------------------------------- |
| 1    | User opens Factory Management   | System displays factory list                |
| 2    | User selects Create Factory     | System displays factory creation form       |
| 3    | User selects Company            | System loads available companies            |
| 4    | User enters factory information | System validates input data                 |
| 5    | User submits creation request   | System checks duplicate factory information |
| 6    | System creates Factory          | Factory is stored successfully              |
| 7    | System creates audit record     | Creation activity is recorded               |
| 8    | System displays success message | Factory becomes available                   |

---

## 6.2 View Factory Information

| Step | Actor Action           | System Response                      |
| ---- | ---------------------- | ------------------------------------ |
| 1    | User selects a factory | System retrieves factory information |
| 2    | User views details     | System displays factory information  |

Displayed information includes:

- Factory Code.
- Factory Name.
- Company.
- Location.
- Status.
- Created Date.
- Workshop count.
- Production line count.
- Machine count.

---

## 6.3 Update Factory Information

| Step | Actor Action                | System Response                    |
| ---- | --------------------------- | ---------------------------------- |
| 1    | User selects factory        | System displays factory details    |
| 2    | User modifies information   | System validates changes           |
| 3    | User submits update request | System updates factory information |
| 4    | System records audit log    | Modification history is stored     |

---

## 6.4 Activate Factory

| Step | Actor Action                    | System Response                |
| ---- | ------------------------------- | ------------------------------ |
| 1    | User selects inactive factory   | System displays factory status |
| 2    | User activates factory          | System validates activation    |
| 3    | System changes status to Active | Factory becomes operational    |
| 4    | System records audit log        | Status change is stored        |

---

## 6.5 Deactivate Factory

| Step | Actor Action                      | System Response                                |
| ---- | --------------------------------- | ---------------------------------------------- |
| 1    | User selects active factory       | System displays factory information            |
| 2    | User deactivates factory          | System checks dependencies                     |
| 3    | System changes status to Inactive | Factory becomes unavailable for new operations |
| 4    | System records audit log          | Status change is stored                        |

---

# 7. Alternative Flows

## AF-01 Duplicate Factory Code

### Condition

Factory code already exists.

Flow:

| Step | Actor Action                       | System Response                |
| ---- | ---------------------------------- | ------------------------------ |
| 1    | User submits factory information   | System checks existing records |
| 2    | Duplicate code detected            | System rejects request         |
| 3    | System displays validation message | User updates information       |

---

## AF-02 Invalid Company Assignment

### Condition

Selected Company does not exist or is inactive.

Flow:

| Step | Actor Action                            | System Response                 |
| ---- | --------------------------------------- | ------------------------------- |
| 1    | User selects Company                    | System validates company status |
| 2    | Company invalid                         | System rejects factory creation |
| 3    | System requests valid Company selection | User selects another Company    |

---

## AF-03 Deactivate Factory With Active Assets

### Condition

Factory contains active operational data.

Examples:

- Active machines.
- Active maintenance tasks.
- Active incidents.

Flow:

| Step | Actor Action                       | System Response                |
| ---- | ---------------------------------- | ------------------------------ |
| 1    | User requests factory deactivation | System checks related entities |
| 2    | Active dependencies detected       | System displays warning        |
| 3    | User confirms action               | System deactivates factory     |
| 4    | Historical data remains unchanged  | System completes operation     |

---

# 8. Exception Flows

## EF-01 Database Failure

### Condition

System cannot save factory information.

Flow:

| Step | Actor Action          | System Response                    |
| ---- | --------------------- | ---------------------------------- |
| 1    | User submits request  | System processes transaction       |
| 2    | Database error occurs | Transaction rollback is performed  |
| 3    | System records error  | User receives failure notification |

---

## EF-02 Unauthorized Access

### Condition

User does not have Factory Management permission.

Flow:

| Step | Actor Action                     | System Response          |
| ---- | -------------------------------- | ------------------------ |
| 1    | User accesses Factory Management | System checks permission |
| 2    | Permission denied                | System blocks operation  |
| 3    | Security event is recorded       | Access rejected          |

---

# 9. Business Rules

## BR-FAC-001 Factory Ownership

Each Factory must belong to exactly one Company.

Example:

```

Company A
├── Factory 01
├── Factory 02
└── Factory 03

```

---

## BR-FAC-002 Factory Code Uniqueness

Each Factory must have a unique Factory Code.

---

## BR-FAC-003 Factory Status

Factory status includes:

```

Active
Inactive

```

---

## BR-FAC-004 Inactive Factory Restriction

Inactive factories:

- Cannot receive new assignments.
- Cannot be selected for new operational activities.
- Historical data remains accessible.

---

## BR-FAC-005 Historical Data Preservation

Deactivating a Factory must not remove:

- Machines.
- Sensors.
- Telemetry history.
- Maintenance history.
- Incident history.
- Audit records.

---

## BR-FAC-006 Factory Access Control

Users can only access factory information according to assigned permissions.

Example:

```

User A

Allowed:
Factory 01

Denied:
Factory 02

```

---

# 10. Data Requirements

## Factory Entity

| Field        | Description                 |
| ------------ | --------------------------- |
| Factory ID   | Unique factory identifier   |
| Company ID   | Parent company identifier   |
| Factory Code | Unique factory code         |
| Factory Name | Factory name                |
| Description  | Factory description         |
| Address      | Factory address             |
| Location     | Geographic location         |
| Status       | Active / Inactive           |
| Created Date | Creation timestamp          |
| Updated Date | Last modification timestamp |

---

# 11. Input Requirements

| Input        | Required |
| ------------ | -------- |
| Company ID   | Yes      |
| Factory Code | Yes      |
| Factory Name | Yes      |
| Address      | No       |
| Description  | No       |
| Status       | Yes      |

---

# 12. Output Requirements

The system provides:

- Factory list.
- Factory details.
- Factory status.
- Factory hierarchy information.
- Operation result messages.

---

# 13. Postconditions

## Successful Execution

After completion:

- Factory information is created or updated.
- Factory hierarchy remains consistent.
- Audit log is generated.

---

## Failed Execution

After failure:

- Factory information is not changed.
- Error is returned.
- Failure is recorded.

---

# 14. Acceptance Criteria

## AC-01 Create Factory

Given:

- A valid Company exists.

When:

- User creates a Factory.

Then:

- Factory is created successfully.
- Factory belongs to selected Company.

---

## AC-02 Update Factory

Given:

- Factory exists.

When:

- User updates factory information.

Then:

- New information is saved.
- Audit log is generated.

---

## AC-03 Deactivate Factory

Given:

- Factory exists.

When:

- User deactivates the Factory.

Then:

- Factory status changes to Inactive.
- Historical data remains available.

---

## AC-04 Factory Access Control

Given:

- User only has access to Factory A.

When:

- User views factories.

Then:

- User can only see Factory A.

---

## AC-05 Factory Hierarchy

Given:

- Factory belongs to Company.

When:

- User views organization structure.

Then:

- Factory appears under correct Company.

---

# 15. Related Requirements

| Requirement             | Reference |
| ----------------------- | --------- |
| Organization Management | FR-01     |
| Factory Management      | FR-02     |
| Workshop Management     | FR-03     |
| Authorization           | FR-09     |
| Audit Log               | FR-12     |
| Organization Management | UCS-03    |

---

# Revision History

| Version | Date       | Author           | Description     |
| ------- | ---------- | ---------------- | --------------- |
| 1.0     | 2026-08-07 | Business Analyst | Initial version |
