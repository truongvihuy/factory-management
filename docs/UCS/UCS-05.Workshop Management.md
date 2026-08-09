# UCS-05. Workshop Management

**Document Name:** Use Case Specification  
**Use Case ID:** UCS-05  
**Use Case Name:** Workshop Management  
**Project:** Factory Management System (FMS)  
**Version:** 1.0  
**Status:** Draft

---

# 1. Use Case Overview

## 1.1 Description

The **Workshop Management** use case describes how the system manages workshops within a factory.

The system allows authorized users to create, update, activate, deactivate, and view workshop information.

A Workshop represents a physical production area inside a Factory and acts as the organizational level between Factory and Production Line.

Workshop Management provides the foundation for:

- Production Line Management.
- Machine organization.
- Factory operational monitoring.
- Factory-level reporting.

---

# 2. Actors

| Actor                 | Description                                           |
| --------------------- | ----------------------------------------------------- |
| System Administrator  | Manages workshop information and configuration        |
| Factory Manager       | Manages workshops within assigned factories           |
| Production Supervisor | Views workshop information for operational monitoring |

---

# 3. Use Case Scope

This use case covers:

- Create Workshop.
- View Workshop details.
- Update Workshop information.
- Activate Workshop.
- Deactivate Workshop.
- Search Workshop.
- Filter Workshop.
- View Workshop hierarchy.

This use case does not cover:

- Factory management.
- Production line management.
- Machine management.
- User authorization assignment.

Those functions are handled by:

- UCS-04 Factory Management.
- UCS-06 Production Line Management.
- UCS-07 Machine Management.
- Authorization Management.

---

# 4. Preconditions

Before executing this use case:

1. User must have Workshop Management permission.
2. Parent Factory must already exist.
3. Factory must be active.
4. System must be available.

---

# 5. Trigger

The use case is triggered when:

- A new workshop is established.
- Workshop information changes.
- Workshop status needs to be updated.
- Users need to view workshop information.

---

# 6. Main Success Flow

## 6.1 Create Workshop

| Step | Actor Action                     | System Response                              |
| ---- | -------------------------------- | -------------------------------------------- |
| 1    | User opens Workshop Management   | System displays workshop list                |
| 2    | User selects Create Workshop     | System displays workshop creation form       |
| 3    | User selects Factory             | System loads available factories             |
| 4    | User enters workshop information | System validates input data                  |
| 5    | User submits creation request    | System checks duplicate workshop information |
| 6    | System creates Workshop          | Workshop is stored successfully              |
| 7    | System links Workshop to Factory | Organization hierarchy is updated            |
| 8    | System records audit log         | Creation activity is stored                  |
| 9    | System displays success message  | Workshop becomes available                   |

---

## 6.2 View Workshop Information

| Step | Actor Action            | System Response                      |
| ---- | ----------------------- | ------------------------------------ |
| 1    | User selects a workshop | System retrieves workshop data       |
| 2    | User views details      | System displays workshop information |

Displayed information includes:

- Workshop Code.
- Workshop Name.
- Parent Factory.
- Description.
- Status.
- Production Line count.
- Machine count.
- Created Date.

---

## 6.3 Update Workshop Information

| Step | Actor Action                | System Response                     |
| ---- | --------------------------- | ----------------------------------- |
| 1    | User selects workshop       | System displays workshop details    |
| 2    | User modifies information   | System validates changes            |
| 3    | User submits update request | System updates workshop information |
| 4    | System records audit log    | Modification history is stored      |

---

## 6.4 Activate Workshop

| Step | Actor Action                    | System Response                 |
| ---- | ------------------------------- | ------------------------------- |
| 1    | User selects inactive workshop  | System displays workshop status |
| 2    | User activates workshop         | System validates factory status |
| 3    | System changes status to Active | Workshop becomes operational    |
| 4    | System records audit log        | Status change is stored         |

---

## 6.5 Deactivate Workshop

| Step | Actor Action                      | System Response                             |
| ---- | --------------------------------- | ------------------------------------------- |
| 1    | User selects active workshop      | System displays workshop information        |
| 2    | User requests deactivation        | System checks dependencies                  |
| 3    | System changes status to Inactive | Workshop cannot be used for new assignments |
| 4    | System records audit log          | Status change is stored                     |

---

# 7. Alternative Flows

## AF-01 Duplicate Workshop Code

### Condition

Workshop code already exists.

Flow:

| Step | Actor Action                       | System Response                  |
| ---- | ---------------------------------- | -------------------------------- |
| 1    | User submits workshop information  | System checks existing workshops |
| 2    | Duplicate code detected            | System rejects request           |
| 3    | System displays validation message | User updates information         |

---

## AF-02 Invalid Factory Assignment

### Condition

Selected Factory does not exist or is inactive.

Flow:

| Step | Actor Action                  | System Response                  |
| ---- | ----------------------------- | -------------------------------- |
| 1    | User selects Factory          | System validates factory         |
| 2    | Factory is invalid            | System rejects workshop creation |
| 3    | System requests valid Factory | User selects another Factory     |

---

## AF-03 Deactivate Workshop With Active Production Lines

### Condition

Workshop contains active production lines.

Flow:

| Step | Actor Action                        | System Response                |
| ---- | ----------------------------------- | ------------------------------ |
| 1    | User requests workshop deactivation | System checks related entities |
| 2    | Active production lines detected    | System displays warning        |
| 3    | User confirms action                | System changes workshop status |
| 4    | Historical data remains unchanged   | Operation completes            |

---

# 8. Exception Flows

## EF-01 Database Failure

### Condition

System cannot save workshop information.

Flow:

| Step | Actor Action          | System Response                    |
| ---- | --------------------- | ---------------------------------- |
| 1    | User submits request  | System processes transaction       |
| 2    | Database error occurs | Transaction rollback               |
| 3    | System records error  | User receives failure notification |

---

## EF-02 Unauthorized Access

### Condition

User does not have Workshop Management permission.

Flow:

| Step | Actor Action                      | System Response          |
| ---- | --------------------------------- | ------------------------ |
| 1    | User accesses Workshop Management | System checks permission |
| 2    | Permission denied                 | System blocks operation  |
| 3    | Security event is recorded        | Access rejected          |

---

# 9. Business Rules

## BR-WKS-001 Workshop Ownership

Each Workshop must belong to exactly one Factory.

Example:

```

Factory A
├── Workshop 01
├── Workshop 02
└── Workshop 03

```

---

## BR-WKS-002 Workshop Code Uniqueness

Each Workshop must have a unique Workshop Code.

---

## BR-WKS-003 Workshop Status

Workshop status includes:

```

Active
Inactive

```

---

## BR-WKS-004 Inactive Workshop Restriction

Inactive workshops:

- Cannot receive new production lines.
- Cannot receive new machine assignments.
- Historical data remains accessible.

---

## BR-WKS-005 Historical Data Preservation

Deactivating a Workshop must not remove:

- Production lines.
- Machines.
- Sensors.
- Telemetry history.
- Maintenance records.
- Incident records.

---

## BR-WKS-006 Factory Dependency

A Workshop can only exist under an active Factory.

---

# 10. Data Requirements

## Workshop Entity

| Field         | Description                 |
| ------------- | --------------------------- |
| Workshop ID   | Unique workshop identifier  |
| Factory ID    | Parent factory identifier   |
| Workshop Code | Unique workshop code        |
| Workshop Name | Workshop name               |
| Description   | Workshop description        |
| Location      | Workshop location           |
| Status        | Active / Inactive           |
| Created Date  | Creation timestamp          |
| Updated Date  | Last modification timestamp |

---

# 11. Input Requirements

| Input         | Required |
| ------------- | -------- |
| Factory ID    | Yes      |
| Workshop Code | Yes      |
| Workshop Name | Yes      |
| Description   | No       |
| Location      | No       |
| Status        | Yes      |

---

# 12. Output Requirements

The system provides:

- Workshop list.
- Workshop details.
- Workshop hierarchy.
- Status information.
- Operation result messages.

---

# 13. Postconditions

## Successful Execution

After completion:

- Workshop is created or updated.
- Workshop remains linked to correct Factory.
- Audit record is generated.

---

## Failed Execution

After failure:

- Workshop data remains unchanged.
- Error information is returned.
- Failure is logged.

---

# 14. Acceptance Criteria

## AC-01 Create Workshop

Given:

- An active Factory exists.

When:

- User creates a valid Workshop.

Then:

- Workshop is created successfully.
- Workshop belongs to selected Factory.

---

## AC-02 Update Workshop

Given:

- Workshop exists.

When:

- User updates workshop information.

Then:

- Information is updated.
- Audit record is generated.

---

## AC-03 Deactivate Workshop

Given:

- Workshop exists.

When:

- User deactivates Workshop.

Then:

- Workshop status changes to Inactive.
- Historical data remains available.

---

## AC-04 Workshop Hierarchy

Given:

- Workshop belongs to Factory.

When:

- User views organization structure.

Then:

- Workshop appears under correct Factory.

---

## AC-05 Permission Control

Given:

- User does not have Workshop Management permission.

When:

- User accesses Workshop Management.

Then:

- System denies access.

---

# 15. Related Requirements

| Requirement                | Reference |
| -------------------------- | --------- |
| Organization Management    | FR-01     |
| Workshop Management        | FR-03     |
| Factory Management         | FR-02     |
| Production Line Management | FR-04     |
| Authorization              | FR-09     |
| Audit Log                  | FR-12     |
| Factory Management         | UCS-04    |

---

# Revision History

| Version | Date       | Author           | Description     |
| ------- | ---------- | ---------------- | --------------- |
| 1.0     | 2026-08-07 | Business Analyst | Initial version |
