# UCS-03. Organization Management

**Document Name:** Use Case Specification  
**Use Case ID:** UCS-03  
**Use Case Name:** Organization Management  
**Project:** Factory Management System (FMS)  
**Version:** 1.0  
**Status:** Draft

---

# 1. Use Case Overview

## 1.1 Description

The **Organization Management** use case describes how the system manages the organizational hierarchy of the Factory Management System (FMS).

The system allows authorized users to create, update, activate, and deactivate organizational entities including:

- Company
- Factory
- Workshop
- Production Line

The organization hierarchy provides the foundation for asset management, user authorization, telemetry monitoring, maintenance management, and reporting.

---

# 2. Actors

| Actor                | Description                                           |
| -------------------- | ----------------------------------------------------- |
| System Administrator | Manages organizational structure                      |
| Factory Manager      | Views and manages assigned factory information        |
| Director             | Views organization information for reporting purposes |

---

# 3. Use Case Scope

This use case covers:

- Create Company.
- Update Company information.
- Activate / deactivate Company.
- Create Factory under Company.
- Update Factory information.
- Activate / deactivate Factory.
- Create Workshop under Factory.
- Update Workshop information.
- Activate / deactivate Workshop.
- Create Production Line under Workshop.
- Update Production Line information.
- Activate / deactivate Production Line.
- View organizational hierarchy.

This use case does not cover:

- Machine management.
- Sensor management.
- User permission assignment.

Those functions are handled by:

- UCS-07 Machine Management.
- UCS-08 Sensor Management.
- Authorization Management.

---

# 4. Organizational Structure

The system manages the following hierarchy:

```text
Company
    │
    └── Factory
            │
            └── Workshop
                    │
                    └── Production Line
                            │
                            └── Machine
```

---

# 5. Preconditions

Before executing this use case:

1. User must have organization management permission.
2. System must be available.
3. Parent organization entity must exist before creating child entities.

Examples:

- Factory requires existing Company.
- Workshop requires existing Factory.
- Production Line requires existing Workshop.

---

# 6. Trigger

The use case is triggered when:

- Administrator needs to configure factory organization structure.
- Organization information changes.
- A new company, factory, workshop, or production line is created.

---

# 7. Main Success Flow

## 7.1 Create Company

| Step | Actor Action                                | System Response                        |
| ---- | ------------------------------------------- | -------------------------------------- |
| 1    | Administrator opens Organization Management | System displays organization hierarchy |
| 2    | Administrator selects Create Company        | System displays company form           |
| 3    | Administrator enters company information    | System validates input                 |
| 4    | Administrator submits request               | System checks duplicate company        |
| 5    | System creates Company                      | Company is stored                      |
| 6    | System records audit log                    | Creation activity is recorded          |
| 7    | System displays successful result           | Company becomes available              |

---

## 7.2 Create Factory

| Step | Actor Action                             | System Response                 |
| ---- | ---------------------------------------- | ------------------------------- |
| 1    | Administrator selects a Company          | System displays company details |
| 2    | Administrator selects Create Factory     | System displays factory form    |
| 3    | Administrator enters factory information | System validates data           |
| 4    | Administrator submits request            | System checks parent Company    |
| 5    | System creates Factory under Company     | Factory hierarchy is updated    |
| 6    | System records audit log                 | Activity is stored              |

---

## 7.3 Create Workshop

| Step | Actor Action                              | System Response                 |
| ---- | ----------------------------------------- | ------------------------------- |
| 1    | Administrator selects Factory             | System displays factory details |
| 2    | Administrator selects Create Workshop     | System displays workshop form   |
| 3    | Administrator enters workshop information | System validates data           |
| 4    | Administrator submits request             | System verifies Factory         |
| 5    | System creates Workshop                   | Workshop is linked to Factory   |
| 6    | System records activity                   | Audit log is created            |

---

## 7.4 Create Production Line

| Step | Actor Action                                     | System Response                      |
| ---- | ------------------------------------------------ | ------------------------------------ |
| 1    | Administrator selects Workshop                   | System displays workshop details     |
| 2    | Administrator selects Create Production Line     | System displays production line form |
| 3    | Administrator enters production line information | System validates data                |
| 4    | Administrator submits request                    | System verifies Workshop             |
| 5    | System creates Production Line                   | Production line becomes available    |
| 6    | System records activity                          | Audit log is created                 |

---

## 7.5 Update Organization Information

| Step | Actor Action                     | System Response                |
| ---- | -------------------------------- | ------------------------------ |
| 1    | User selects organization entity | System displays details        |
| 2    | User updates information         | System validates changes       |
| 3    | User submits update              | System saves changes           |
| 4    | System records audit log         | Modification history is stored |

---

## 7.6 Activate / Deactivate Organization Entity

| Step | Actor Action                     | System Response                |
| ---- | -------------------------------- | ------------------------------ |
| 1    | User selects organization entity | System displays current status |
| 2    | User changes status              | System validates impact        |
| 3    | System updates status            | Entity status is changed       |
| 4    | System records activity          | Audit log is created           |

---

# 8. Alternative Flows

## AF-01 Duplicate Organization Code

### Condition

Organization code already exists.

Flow:

| Step | Actor Action                          | System Response                |
| ---- | ------------------------------------- | ------------------------------ |
| 1    | User submits organization information | System checks existing records |
| 2    | Duplicate code detected               | System rejects request         |
| 3    | System displays validation message    | User updates information       |

---

## AF-02 Missing Parent Entity

### Condition

Required parent entity does not exist.

Examples:

- Creating Factory without Company.
- Creating Workshop without Factory.

Flow:

| Step | Actor Action                  | System Response            |
| ---- | ----------------------------- | -------------------------- |
| 1    | User submits creation request | System validates hierarchy |
| 2    | Parent entity missing         | System rejects request     |
| 3    | System displays error message | User selects valid parent  |

---

# 9. Exception Flows

## EF-01 Database Error

### Condition

System cannot save organization data.

Flow:

| Step | Actor Action            | System Response               |
| ---- | ----------------------- | ----------------------------- |
| 1    | User submits request    | System processes transaction  |
| 2    | Database failure occurs | Transaction is rolled back    |
| 3    | System logs error       | User receives failure message |

---

## EF-02 Unauthorized Access

### Condition

User does not have organization management permission.

Flow:

| Step | Actor Action                      | System Response          |
| ---- | --------------------------------- | ------------------------ |
| 1    | User accesses organization module | System checks permission |
| 2    | Permission denied                 | System blocks operation  |
| 3    | Security event is recorded        | Access rejected          |

---

# 10. Business Rules

## BR-ORG-001 Organization Hierarchy

The system shall maintain the following hierarchy:

```text
Company
    |
    Factory
        |
        Workshop
            |
            Production Line
```

---

## BR-ORG-002 Factory Ownership

Each Factory must belong to exactly one Company.

---

## BR-ORG-003 Workshop Ownership

Each Workshop must belong to exactly one Factory.

---

## BR-ORG-004 Production Line Ownership

Each Production Line must belong to exactly one Workshop.

---

## BR-ORG-005 Unique Code

Each organization entity must have a unique code within the system.

---

## BR-ORG-006 Status Management

Organization entities support:

```text
Active
Inactive
```

Inactive entities cannot be used for new assignments.

---

## BR-ORG-007 Historical Data Preservation

Deactivating organization entities must not remove:

- Historical machine assignments.
- Historical telemetry.
- Historical maintenance records.
- Historical incidents.

---

# 11. Data Requirements

## Company

| Field        | Description         |
| ------------ | ------------------- |
| Company ID   | Unique identifier   |
| Company Code | Unique company code |
| Company Name | Company name        |
| Address      | Company address     |
| Status       | Active / Inactive   |
| Created Date | Creation timestamp  |

---

## Factory

| Field        | Description         |
| ------------ | ------------------- |
| Factory ID   | Unique identifier   |
| Factory Code | Unique factory code |
| Factory Name | Factory name        |
| Company ID   | Parent company      |
| Location     | Factory location    |
| Status       | Active / Inactive   |

---

## Workshop

| Field         | Description          |
| ------------- | -------------------- |
| Workshop ID   | Unique identifier    |
| Workshop Code | Unique workshop code |
| Workshop Name | Workshop name        |
| Factory ID    | Parent factory       |
| Status        | Active / Inactive    |

---

## Production Line

| Field              | Description                 |
| ------------------ | --------------------------- |
| Production Line ID | Unique identifier           |
| Line Code          | Unique production line code |
| Line Name          | Production line name        |
| Workshop ID        | Parent workshop             |
| Status             | Active / Inactive           |

---

# 12. Input Requirements

| Input         | Required |
| ------------- | -------- |
| Code          | Yes      |
| Name          | Yes      |
| Parent Entity | Yes      |
| Status        | Yes      |

---

# 13. Output Requirements

The system provides:

- Organization hierarchy view.
- Organization details.
- Creation result.
- Update result.
- Status change result.

---

# 14. Postconditions

## Successful Execution

After completion:

- Organization entity is created or updated.
- Hierarchy relationship is maintained.
- Audit record is generated.

---

## Failed Execution

After failure:

- No invalid organization data is stored.
- Error information is returned.
- Failure is logged.

---

# 15. Acceptance Criteria

## AC-01 Create Company

Given:

- User has organization management permission.

When:

- User creates a valid company.

Then:

- Company is created successfully.
- Company appears in organization hierarchy.

---

## AC-02 Create Factory

Given:

- Company exists.

When:

- User creates a factory.

Then:

- Factory is linked to the correct company.

---

## AC-03 Create Workshop

Given:

- Factory exists.

When:

- User creates workshop.

Then:

- Workshop belongs to selected factory.

---

## AC-04 Create Production Line

Given:

- Workshop exists.

When:

- User creates production line.

Then:

- Production line belongs to selected workshop.

---

## AC-05 Preserve Historical Data

Given:

- Organization entity contains historical data.

When:

- Entity is deactivated.

Then:

- Historical records remain unchanged.

---

# 16. Related Requirements

| Requirement                | Reference |
| -------------------------- | --------- |
| Organization Management    | FR-01     |
| Factory Management         | FR-02     |
| Workshop Management        | FR-03     |
| Production Line Management | FR-04     |
| Authorization              | FR-09     |
| Audit Log                  | FR-12     |

---

# Revision History

| Version | Date       | Author           | Description     |
| ------- | ---------- | ---------------- | --------------- |
| 1.0     | 2026-08-07 | Business Analyst | Initial version |
