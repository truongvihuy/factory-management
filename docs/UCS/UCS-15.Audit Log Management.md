# UCS-15. Audit Log Management

**Document Name:** Use Case Specification  
**Use Case ID:** UCS-15  
**Use Case Name:** Audit Log Management  
**Project:** Factory Management System (FMS)  
**Version:** 1.0  
**Status:** Draft

---

# 1. Use Case Overview

## 1.1 Description

The **Audit Log Management** use case describes how the Factory Management System records, stores, and provides access to system activities performed by users and system processes.

The purpose of Audit Log Management is to:

- Ensure traceability of system activities.
- Support security monitoring.
- Support operational investigation.
- Track changes to important business data.
- Provide accountability for user actions.

The system records activities related to authentication, data modification, configuration changes, and permission changes.

---

# 2. Actors

| Actor                  | Description                                             |
| ---------------------- | ------------------------------------------------------- |
| System Administrator   | Reviews and manages audit information                   |
| Factory Manager        | Reviews operational changes within authorized factories |
| System                 | Automatically records system activities                 |
| Security Administrator | Investigates security-related activities                |

---

# 3. Use Case Scope

This use case covers:

- Record user activities.
- Record authentication activities.
- Record CRUD operations.
- Record configuration changes.
- Record authorization changes.
- Search audit logs.
- Filter audit logs.
- View audit details.

This use case does not cover:

- User management.
- Authentication processing.
- Authorization configuration.
- Business transaction execution.

Related use cases:

- UCS-01 User Authentication.
- UCS-02 User Management.
- UCS-03 Organization Management.
- UCS-04 Factory Management.
- UCS-05 Workshop Management.
- UCS-06 Production Line Management.
- UCS-07 Machine Management.
- UCS-08 Sensor Management.
- UCS-10 Alert Management.
- UCS-12 Maintenance Management.

---

# 4. Preconditions

Before executing this use case:

1. Audit logging functionality must be enabled.
2. User must have audit log permission.
3. System activities must exist.

---

# 5. Trigger

The use case is triggered when:

- A user performs an auditable action.
- A system configuration is changed.
- A permission is modified.
- An administrator searches audit records.

---

# 6. Audit Event Types

The system shall record the following activities.

## 6.1 Authentication Events

Includes:

- User login.
- User logout.
- Failed login attempt.
- Password reset.
- Account lock.
- Account unlock.

---

## 6.2 Data Modification Events

Includes:

- Create entity.
- Update entity.
- Delete entity.
- Activate entity.
- Deactivate entity.

Applicable entities:

- Company.
- Factory.
- Workshop.
- Production Line.
- Machine.
- Sensor.
- Maintenance.
- Incident.
- Alert.

---

## 6.3 Authorization Events

Includes:

- Role assignment.
- Role removal.
- Permission granted.
- Permission revoked.
- Factory access changed.

---

## 6.4 Configuration Events

Includes:

- Alert threshold changes.
- System configuration changes.
- Business rule configuration changes.

---

# 7. Main Success Flow

# 7.1 Record Audit Event

| Step | Actor Action                        | System Response                |
| ---- | ----------------------------------- | ------------------------------ |
| 1    | User performs an auditable action   | System receives action event   |
| 2    | System identifies user and activity | Audit information is collected |
| 3    | System creates audit record         | Audit log is stored            |
| 4    | Action completes successfully       | User receives operation result |

---

# 7.2 Search Audit Logs

| Step | Actor Action                  | System Response                  |
| ---- | ----------------------------- | -------------------------------- |
| 1    | User opens Audit Log module   | System displays search interface |
| 2    | User enters search criteria   | System validates input           |
| 3    | User submits request          | System searches audit records    |
| 4    | System displays matching logs | User reviews information         |

Supported filters:

- User.
- Action type.
- Entity type.
- Entity ID.
- Factory.
- Date range.
- Result status.

---

# 7.3 View Audit Detail

| Step | Actor Action                      | System Response               |
| ---- | --------------------------------- | ----------------------------- |
| 1    | User selects audit record         | System retrieves details      |
| 2    | System displays audit information | User reviews activity history |

Audit details include:

- User information.
- Action performed.
- Entity affected.
- Previous value.
- New value.
- Timestamp.
- IP address.
- Operation result.

---

# 8. Alternative Flows

# AF-01 Audit Search Returns No Data

### Condition

No audit records match search criteria.

Flow:

| Step | Actor Action              | System Response              |
| ---- | ------------------------- | ---------------------------- |
| 1    | User searches audit logs  | System processes request     |
| 2    | No matching records found | System displays empty result |
| 3    | User changes criteria     | Search can be executed again |

---

# AF-02 Large Audit Result

### Condition

Search result contains many records.

Flow:

| Step | Actor Action          | System Response               |
| ---- | --------------------- | ----------------------------- |
| 1    | User performs search  | System evaluates result size  |
| 2    | Large result detected | System applies pagination     |
| 3    | User navigates pages  | System displays audit records |

---

# 9. Exception Flows

# EF-01 Audit Recording Failure

### Condition

System cannot save audit information.

Flow:

| Step | Actor Action           | System Response               |
| ---- | ---------------------- | ----------------------------- |
| 1    | User performs action   | System processes operation    |
| 2    | Audit creation fails   | Error is detected             |
| 3    | System records failure | Administrator can investigate |

---

# EF-02 Unauthorized Audit Access

### Condition

User does not have permission.

Flow:

| Step | Actor Action                     | System Response             |
| ---- | -------------------------------- | --------------------------- |
| 1    | User requests audit logs         | System validates permission |
| 2    | Permission denied                | Access is rejected          |
| 3    | Unauthorized attempt is recorded | Security event is created   |

---

# 10. Business Rules

## BR-AUD-001 Audit Logging

The system shall record all defined auditable activities.

---

## BR-AUD-002 Immutable Audit Data

Audit records cannot be modified or deleted by normal users.

---

## BR-AUD-003 User Traceability

Every audit record must identify:

- User.
- Action.
- Timestamp.

---

## BR-AUD-004 Data Change Tracking

For update operations, the system should store:

- Previous value.
- New value.

---

## BR-AUD-005 Access Control

Only authorized users can view audit logs.

---

## BR-AUD-006 Historical Retention

Audit records must be retained according to system retention policy.

---

# 11. Data Requirements

## Audit Log Entity

| Field       | Description              |
| ----------- | ------------------------ |
| Audit ID    | Unique identifier        |
| User ID     | User performing action   |
| Username    | User display information |
| Action Type | Activity performed       |
| Entity Type | Affected entity          |
| Entity ID   | Affected object          |
| Old Value   | Previous data state      |
| New Value   | New data state           |
| Factory ID  | Data scope               |
| IP Address  | Client address           |
| Timestamp   | Event time               |
| Status      | Success or failure       |

---

# 12. Input Requirements

| Input              | Required |
| ------------------ | -------- |
| User Action        | Yes      |
| User ID            | Yes      |
| Entity Information | Optional |
| Change Information | Optional |
| Timestamp          | Yes      |

---

# 13. Output Requirements

The system provides:

- Audit records.
- Activity history.
- Change history.
- Security investigation information.

---

# 14. Postconditions

## Successful Execution

After completion:

- Activity is recorded.
- Audit information is searchable.
- User actions are traceable.

---

## Failed Execution

After failure:

- Error is logged.
- Business transaction status follows system policy.
- Administrator can investigate the issue.

---

# 15. Acceptance Criteria

## AC-01 Record Login Activity

Given:

- User logs into the system.

When:

- Authentication succeeds.

Then:

- Login activity is recorded.

---

## AC-02 Record Data Changes

Given:

- User updates an entity.

When:

- Update operation completes.

Then:

- Audit record contains change information.

---

## AC-03 Search Audit Logs

Given:

- Audit records exist.

When:

- Authorized user searches logs.

Then:

- Matching audit records are displayed.

---

## AC-04 Protect Audit Records

Given:

- User attempts to modify audit data.

When:

- User does not have special permission.

Then:

- System rejects the operation.

---

## AC-05 Track Permission Changes

Given:

- User permissions are modified.

When:

- Permission update completes.

Then:

- Audit record is created.

---

# 16. Related Requirements

| Requirement              | Reference |
| ------------------------ | --------- |
| User Authentication      | UCS-01    |
| User Management          | UCS-02    |
| Authorization Management | UCS-09    |
| Organization Management  | UCS-03    |
| Factory Management       | UCS-04    |
| Machine Management       | UCS-07    |
| Sensor Management        | UCS-08    |
| Alert Management         | UCS-10    |
| Maintenance Management   | UCS-12    |

---

# Revision History

| Version | Date       | Author           | Description     |
| ------- | ---------- | ---------------- | --------------- |
| 1.0     | 2026-08-07 | Business Analyst | Initial version |
