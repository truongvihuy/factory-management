# UCS-11. Incident Management

**Document Name:** Use Case Specification  
**Use Case ID:** UCS-11  
**Use Case Name:** Incident Management  
**Project:** Factory Management System (FMS)  
**Version:** 1.0  
**Status:** Draft

---

# 1. Use Case Overview

## 1.1 Description

The **Incident Management** use case describes how the Factory Management System manages operational incidents related to industrial machines and factory operations.

An incident represents an operational issue that requires investigation, assignment, resolution, and verification.

The purpose of Incident Management is to:

- Standardize incident handling processes.
- Ensure incidents are tracked from detection to closure.
- Improve response and resolution time.
- Maintain complete incident history.
- Support SLA monitoring.

---

# 2. Actors

| Actor                 | Description                                          |
| --------------------- | ---------------------------------------------------- |
| System                | Creates incidents from alerts or system events       |
| Factory Manager       | Oversees incidents within factories                  |
| Production Supervisor | Reports and monitors operational incidents           |
| Maintenance Engineer  | Investigates and resolves technical incidents        |
| Operator              | Reports machine problems and follows incident status |
| Maintenance Planner   | Coordinates maintenance activities                   |

---

# 3. Use Case Scope

This use case covers:

- Create incidents.
- Link incidents with machines.
- Assign incidents.
- Track incident lifecycle.
- Monitor SLA.
- Update incident status.
- Add investigation information.
- Verify incident resolution.
- Close incidents.
- Maintain incident history.

This use case does not cover:

- Telemetry collection.
- Alert rule configuration.
- Maintenance execution.
- Machine management.
- Notification implementation.

Related use cases:

- UCS-07 Machine Management.
- UCS-09 Telemetry Management.
- UCS-10 Alert Management.
- UCS-12 Maintenance Management.
- UCS-16 Notification Management.

---

# 4. Preconditions

Before executing this use case:

1. Machine must exist.
2. User must have incident management permission.
3. Factory must be configured.
4. Responsible users must exist.
5. Incident workflow must be available.

---

# 5. Trigger

The use case is triggered when:

- A machine failure occurs.
- A critical alert requires investigation.
- User manually reports an operational issue.
- System detects an abnormal operational event.

---

# 6. Incident Lifecycle

```text
Open
 │
 ▼
Assigned
 │
 ▼
In Progress
 │
 ▼
Resolved
 │
 ▼
Verified
 │
 ▼
Closed
```

---

# 7. Incident Priority

The system supports incident priorities:

| Priority | Description                    |
| -------- | ------------------------------ |
| Low      | Minor operational impact       |
| Medium   | Requires planned response      |
| High     | Significant operational impact |
| Critical | Immediate response required    |

---

# 8. Main Success Flow

# 8.1 Create Incident

| Step | Actor Action                     | System Response                  |
| ---- | -------------------------------- | -------------------------------- |
| 1    | User selects Create Incident     | System displays incident form    |
| 2    | User enters incident information | System validates input           |
| 3    | User selects machine             | System links incident to machine |
| 4    | User submits incident            | System creates incident record   |
| 5    | System assigns initial status    | Status becomes Open              |
| 6    | System records history           | Creation activity is stored      |

---

# 8.2 Create Incident From Alert

| Step | Actor Action                      | System Response                 |
| ---- | --------------------------------- | ------------------------------- |
| 1    | Critical alert is generated       | System evaluates incident rule  |
| 2    | Incident creation is required     | System creates incident         |
| 3    | System links alert information    | Alert reference is stored       |
| 4    | System assigns priority           | Incident priority is determined |
| 5    | System notifies responsible users | Incident notification is sent   |

---

# 8.3 Assign Incident

| Step | Actor Action                      | System Response                     |
| ---- | --------------------------------- | ----------------------------------- |
| 1    | Supervisor reviews incident       | System displays details             |
| 2    | User selects responsible engineer | System validates assignment         |
| 3    | User confirms assignment          | Incident status changes to Assigned |
| 4    | System records assignment history | Assignment information is stored    |

---

# 8.4 Investigate Incident

| Step | Actor Action                      | System Response                   |
| ---- | --------------------------------- | --------------------------------- |
| 1    | Engineer receives incident        | Engineer starts investigation     |
| 2    | Engineer updates status           | Status changes to In Progress     |
| 3    | Engineer adds findings            | System stores investigation notes |
| 4    | Engineer performs troubleshooting | Incident progress is tracked      |

---

# 8.5 Resolve Incident

| Step | Actor Action                      | System Response                   |
| ---- | --------------------------------- | --------------------------------- |
| 1    | Engineer completes repair         | Resolution information is entered |
| 2    | Engineer submits resolution       | System validates information      |
| 3    | System updates status             | Status changes to Resolved        |
| 4    | System records resolution history | Resolution data is stored         |

---

# 8.6 Verify Incident Resolution

| Step | Actor Action                          | System Response                  |
| ---- | ------------------------------------- | -------------------------------- |
| 1    | Supervisor reviews resolution         | System displays incident details |
| 2    | Supervisor verifies machine condition | Verification result is recorded  |
| 3    | User confirms resolution              | Status changes to Verified       |

---

# 8.7 Close Incident

| Step | Actor Action                      | System Response                    |
| ---- | --------------------------------- | ---------------------------------- |
| 1    | User closes completed incident    | System validates closure condition |
| 2    | System updates status             | Status changes to Closed           |
| 3    | System stores closure information | Incident becomes historical record |

---

# 8.8 Monitor SLA

| Step | Actor Action                 | System Response          |
| ---- | ---------------------------- | ------------------------ |
| 1    | Incident is created          | SLA timer starts         |
| 2    | System tracks response time  | SLA status is calculated |
| 3    | SLA threshold is exceeded    | Escalation is triggered  |
| 4    | System records SLA violation | History is updated       |

---

# 9. Alternative Flows

# AF-01 Duplicate Incident

### Condition

A similar active incident already exists.

Flow:

| Step | Actor Action           | System Response                  |
| ---- | ---------------------- | -------------------------------- |
| 1    | User creates incident  | System searches active incidents |
| 2    | Similar incident found | System warns user                |
| 3    | User confirms          | System links or creates incident |

---

# AF-02 Incident Created Without Alert

### Condition

Operational issue is discovered manually.

Flow:

| Step | Actor Action            | System Response               |
| ---- | ----------------------- | ----------------------------- |
| 1    | User reports issue      | System displays incident form |
| 2    | User enters information | System validates data         |
| 3    | Incident is created     | Status becomes Open           |

---

# AF-03 Incident Reopened

### Condition

The problem occurs again after closure.

Flow:

| Step | Actor Action             | System Response               |
| ---- | ------------------------ | ----------------------------- |
| 1    | User reports recurrence  | System checks closed incident |
| 2    | User reopens incident    | Status changes to Open        |
| 3    | Previous history remains | New lifecycle begins          |

---

# 10. Exception Flows

# EF-01 Assignment Failure

### Condition

No available responsible user.

Flow:

| Step | Actor Action                 | System Response       |
| ---- | ---------------------------- | --------------------- |
| 1    | Incident requires assignment | System searches users |
| 2    | No user available            | Assignment fails      |
| 3    | System records warning       | Escalation may occur  |

---

# EF-02 Resolution Verification Failed

### Condition

Machine still has abnormal condition.

Flow:

| Step | Actor Action                    | System Response                |
| ---- | ------------------------------- | ------------------------------ |
| 1    | Supervisor verifies incident    | Condition remains abnormal     |
| 2    | Verification fails              | Incident status updated        |
| 3    | Incident returns to In Progress | Further investigation required |

---

# 11. Business Rules

## BR-IN-001 Incident Association

Every incident must belong to one machine.

Relationship:

```text
Machine
   │
   ├── Alert
   │
   └── Incident
```

---

## BR-IN-002 Incident Lifecycle

Incident status must follow:

```text
Open
Assigned
In Progress
Resolved
Verified
Closed
```

---

## BR-IN-003 Incident History

The system must maintain:

- Creation history.
- Assignment history.
- Status changes.
- Investigation notes.
- Resolution information.
- Closure information.

---

## BR-IN-004 SLA Management

Critical incidents must comply with defined SLA requirements.

Example:

| Incident Type | Response Time |
| ------------- | ------------- |
| Critical      | 15 minutes    |
| High          | 1 hour        |

---

## BR-IN-005 Incident Priority

Every incident must have:

- Priority.
- Severity.
- Responsible user.
- Related machine.

---

## BR-IN-006 Major Incident

Multiple related incidents may be grouped into a Major Incident.

Example:

```text
Major Incident
      |
      ├── Machine A Failure
      ├── Machine B Failure
      └── Production Line Issue
```

---

## BR-IN-007 Historical Integrity

Closed incidents cannot be deleted.

---

# 12. Data Requirements

## Incident Entity

| Field         | Description              |
| ------------- | ------------------------ |
| Incident ID   | Unique identifier        |
| Incident Code | Incident reference       |
| Machine ID    | Related machine          |
| Alert ID      | Related alert (optional) |
| Title         | Incident title           |
| Description   | Incident details         |
| Priority      | Incident priority        |
| Severity      | Impact level             |
| Status        | Lifecycle status         |
| Assigned User | Responsible person       |
| Created Time  | Creation timestamp       |
| Resolved Time | Resolution timestamp     |
| Closed Time   | Closure timestamp        |

---

## Incident History Entity

| Field       | Description            |
| ----------- | ---------------------- |
| History ID  | Unique identifier      |
| Incident ID | Related incident       |
| Action      | Performed action       |
| User ID     | Performer              |
| Timestamp   | Action time            |
| Note        | Additional information |

---

# 13. Input Requirements

| Input           | Required |
| --------------- | -------- |
| Machine ID      | Yes      |
| Incident Title  | Yes      |
| Description     | Yes      |
| Priority        | Yes      |
| Severity        | Yes      |
| Assigned User   | Optional |
| Resolution Note | Optional |

---

# 14. Output Requirements

The system provides:

- Incident list.
- Incident details.
- Incident status.
- SLA status.
- Incident history.
- Resolution information.

---

# 15. Postconditions

## Successful Execution

After completion:

- Incident lifecycle is completed.
- Resolution is verified.
- History is maintained.
- SLA information is recorded.

---

## Failed Execution

After failure:

- Incident remains unchanged.
- Error is logged.
- Existing historical data is preserved.

---

# 16. Acceptance Criteria

## AC-01 Create Incident

Given:

- A machine exists.

When:

- User creates an incident.

Then:

- System creates incident successfully.

---

## AC-02 Assign Incident

Given:

- Incident is Open.

When:

- User assigns engineer.

Then:

- Incident status changes to Assigned.

---

## AC-03 Track SLA

Given:

- Critical incident exists.

When:

- SLA timer runs.

Then:

- System calculates SLA status.

---

## AC-04 Resolve Incident

Given:

- Engineer completes investigation.

When:

- Resolution is submitted.

Then:

- Incident changes to Resolved.

---

## AC-05 Close Incident

Given:

- Resolution is verified.

When:

- User closes incident.

Then:

- Incident status changes to Closed.

---

# 17. Related Requirements

| Requirement             | Reference |
| ----------------------- | --------- |
| Machine Management      | UCS-07    |
| Telemetry Management    | UCS-09    |
| Alert Management        | UCS-10    |
| Maintenance Management  | UCS-12    |
| Notification Management | UCS-16    |
| Audit Log               | UCS-23    |

---

# Revision History

| Version | Date       | Author           | Description     |
| ------- | ---------- | ---------------- | --------------- |
| 1.0     | 2026-08-07 | Business Analyst | Initial version |
