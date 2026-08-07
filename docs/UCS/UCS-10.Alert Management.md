# UCS-10. Alert Management

**Document Name:** Use Case Specification  
**Use Case ID:** UCS-10  
**Use Case Name:** Alert Management  
**Project:** Factory Management System (FMS)  
**Version:** 1.0  
**Status:** Draft  

---

# 1. Use Case Overview

## 1.1 Description

The **Alert Management** use case describes how the Factory Management System detects abnormal machine conditions, generates alerts, notifies responsible users, tracks alert lifecycle, and maintains alert history.

Alerts are generated based on telemetry data collected from machines and evaluated against configured alert rules.

The purpose of Alert Management is to:

- Detect abnormal equipment conditions.
- Reduce machine downtime.
- Support proactive maintenance activities.
- Provide operational visibility.
- Ensure responsible users can respond within required SLA.

---

# 2. Actors

| Actor | Description |
| --- | --- |
| System | Evaluates telemetry data and generates alerts |
| Factory Manager | Monitors and manages alerts within factories |
| Production Supervisor | Reviews machine alerts and operational issues |
| Maintenance Engineer | Handles technical issues related to alerts |
| Operator | Acknowledges assigned alerts |
| Maintenance Planner | Creates follow-up maintenance activities |

---

# 3. Use Case Scope

This use case covers:

- Configure alert rules.
- Evaluate telemetry conditions.
- Generate alerts.
- Assign alert severity.
- Notify users.
- Acknowledge alerts.
- Escalate unresolved alerts.
- Resolve alerts.
- Close alerts.
- View alert history.

This use case does not cover:

- Telemetry collection.
- Sensor management.
- Machine management.
- Notification service implementation.
- Incident resolution process.

Related use cases:

- UCS-07 Machine Management.
- UCS-08 Sensor Management.
- UCS-09 Telemetry Management.
- UCS-11 Incident Management.
- UCS-16 Notification Management.

---

# 4. Preconditions

Before executing this use case:

1. Machine must exist and be active.
2. Sensor must be assigned to machine.
3. Telemetry data must be available.
4. Alert rule must be configured.
5. User must have alert management permission.
6. Notification channels must be available.

---

# 5. Trigger

The use case is triggered when:

- New telemetry data is received.
- Telemetry value exceeds configured threshold.
- User manually reviews alert status.
- Escalation time limit is reached.

---

# 6. Alert Severity

The system supports the following alert levels:

| Severity | Description |
| --- | --- |
| Info | Informational condition |
| Warning | Abnormal condition requiring attention |
| Critical | Serious condition requiring immediate action |

---

# 7. Alert Lifecycle

```text
Detected
    │
    ▼
Open
    │
    ▼
Acknowledged
    │
    ▼
In Progress
    │
    ▼
Resolved
    │
    ▼
Closed
````

---

# 8. Main Success Flow

# 8.1 Configure Alert Rule

| Step | Actor Action                   | System Response                    |
| ---- | ------------------------------ | ---------------------------------- |
| 1    | User opens Alert Configuration | System displays alert rules        |
| 2    | User selects Create Rule       | System displays configuration form |
| 3    | User enters rule information   | System validates input             |
| 4    | User submits rule              | System stores configuration        |
| 5    | System activates rule          | Rule becomes available             |
| 6    | System records audit log       | Configuration change is tracked    |

---

# 8.2 Generate Alert

| Step | Actor Action                 | System Response                  |
| ---- | ---------------------------- | -------------------------------- |
| 1    | Telemetry data is received   | System evaluates alert rules     |
| 2    | Condition matches rule       | System creates alert             |
| 3    | System assigns severity      | Alert priority is determined     |
| 4    | System links alert           | Alert is associated with machine |
| 5    | System stores alert history  | Alert record is created          |
| 6    | System triggers notification | Responsible users are notified   |

---

# 8.3 Acknowledge Alert

| Step | Actor Action               | System Response                   |
| ---- | -------------------------- | --------------------------------- |
| 1    | User views active alert    | System displays alert details     |
| 2    | User acknowledges alert    | System updates status             |
| 3    | System records user action | Acknowledgement history is stored |
| 4    | System assigns responder   | Alert owner is recorded           |

---

# 8.4 Resolve Alert

| Step | Actor Action                        | System Response               |
| ---- | ----------------------------------- | ----------------------------- |
| 1    | User investigates alert             | Technical action is performed |
| 2    | User updates resolution information | System validates input        |
| 3    | User marks alert resolved           | System updates status         |
| 4    | System records resolution           | Resolution history is stored  |

---

# 8.5 Close Alert

| Step | Actor Action                      | System Response                   |
| ---- | --------------------------------- | --------------------------------- |
| 1    | User verifies resolution          | System displays alert information |
| 2    | User closes alert                 | System updates lifecycle status   |
| 3    | System stores closing information | Alert becomes historical record   |

---

# 8.6 Escalate Alert

| Step | Actor Action                | System Response                             |
| ---- | --------------------------- | ------------------------------------------- |
| 1    | Alert remains unresolved    | System checks escalation rule               |
| 2    | SLA threshold exceeded      | System escalates alert                      |
| 3    | System notifies higher role | Supervisor or manager receives notification |
| 4    | System records escalation   | Escalation history is stored                |

---

# 9. Alternative Flows

# AF-01 Duplicate Active Alert

### Condition

The same abnormal condition already has an active alert.

Flow:

| Step | Actor Action                       | System Response               |
| ---- | ---------------------------------- | ----------------------------- |
| 1    | Telemetry triggers rule            | System checks existing alerts |
| 2    | Active alert exists                | System updates existing alert |
| 3    | New duplicate alert is not created | Alert history is maintained   |

---

# AF-02 Alert Rule Disabled

### Condition

Configured rule is inactive.

Flow:

| Step | Actor Action       | System Response        |
| ---- | ------------------ | ---------------------- |
| 1    | Telemetry received | System evaluates rules |
| 2    | Rule disabled      | Condition ignored      |
| 3    | No alert generated | Event is recorded      |

---

# AF-03 Low Priority Alert

### Condition

Alert severity is Info.

Flow:

| Step | Actor Action                | System Response             |
| ---- | --------------------------- | --------------------------- |
| 1    | Condition detected          | System creates Info alert   |
| 2    | Notification policy checked | Notification may be limited |
| 3    | Alert stored                | History maintained          |

---

# 10. Exception Flows

# EF-01 Notification Failure

### Condition

Notification cannot be delivered.

Flow:

| Step | Actor Action         | System Response              |
| ---- | -------------------- | ---------------------------- |
| 1    | Alert generated      | Notification process starts  |
| 2    | Delivery fails       | System records failure       |
| 3    | Alert remains active | Retry mechanism is triggered |

---

# EF-02 Alert Storage Failure

### Condition

System cannot store alert information.

Flow:

| Step | Actor Action             | System Response      |
| ---- | ------------------------ | -------------------- |
| 1    | Alert condition detected | Transaction starts   |
| 2    | Storage error occurs     | Transaction rollback |
| 3    | System records error     | Failure logged       |

---

# 11. Business Rules

## BR-AL-001 Alert Source

Every alert must be associated with:

```text
Machine
    │
    └── Sensor
            │
            └── Telemetry Condition
```

---

## BR-AL-002 Alert Severity

Every alert must contain a severity level:

* Info.
* Warning.
* Critical.

---

## BR-AL-003 Alert Status

Alert status includes:

```text
Open
Acknowledged
In Progress
Resolved
Closed
```

---

## BR-AL-004 Alert History

The system must maintain:

* Creation time.
* Acknowledgement time.
* Resolution time.
* Closure time.
* User activities.

---

## BR-AL-005 Critical Alert Handling

Critical alerts must:

* Notify responsible users immediately.
* Support escalation.
* Be tracked until closure.

---

## BR-AL-006 Alert Association

One alert belongs to one machine.

Multiple alerts may exist for the same machine.

Example:

```text
Machine A

 ├── High Temperature Alert
 ├── High Vibration Alert
 └── Power Failure Alert
```

---

## BR-AL-007 Alert Data Integrity

Historical alerts cannot be deleted.

---

# 12. Data Requirements

## Alert Entity

| Field             | Description          |
| ----------------- | -------------------- |
| Alert ID          | Unique identifier    |
| Alert Code        | Alert identifier     |
| Machine ID        | Related machine      |
| Sensor ID         | Related sensor       |
| Alert Type        | Alert category       |
| Severity          | Alert level          |
| Condition         | Trigger condition    |
| Status            | Current status       |
| Created Time      | Alert creation time  |
| Acknowledged Time | Acknowledgement time |
| Resolved Time     | Resolution time      |
| Closed Time       | Closure time         |

---

## Alert History Entity

| Field      | Description            |
| ---------- | ---------------------- |
| History ID | Unique identifier      |
| Alert ID   | Related alert          |
| Action     | User action            |
| User ID    | Performer              |
| Timestamp  | Action time            |
| Note       | Additional information |

---

# 13. Input Requirements

| Input           | Required |
| --------------- | -------- |
| Telemetry Data  | Yes      |
| Alert Rule      | Yes      |
| Severity        | Yes      |
| Machine ID      | Yes      |
| Sensor ID       | Yes      |
| Resolution Note | Optional |

---

# 14. Output Requirements

The system provides:

* Active alert list.
* Alert details.
* Alert history.
* Alert status.
* Alert escalation history.

---

# 15. Postconditions

## Successful Execution

After completion:

* Alert is generated correctly.
* Responsible users are notified.
* Alert lifecycle is tracked.
* Historical records are maintained.

---

## Failed Execution

After failure:

* Alert generation failure is recorded.
* Existing data remains unchanged.
* System retries where applicable.

---

# 16. Acceptance Criteria

## AC-01 Generate Alert

Given:

* Telemetry exceeds configured threshold.

When:

* Alert evaluation runs.

Then:

* System creates an alert.

---

## AC-02 Notify Users

Given:

* Critical alert exists.

When:

* Alert is generated.

Then:

* Responsible users receive notification.

---

## AC-03 Acknowledge Alert

Given:

* Active alert exists.

When:

* User acknowledges alert.

Then:

* Alert status changes to Acknowledged.

---

## AC-04 Resolve Alert

Given:

* Alert requires action.

When:

* User completes resolution.

Then:

* Alert status changes to Resolved.

---

## AC-05 Maintain History

Given:

* Alert lifecycle changes.

When:

* User performs actions.

Then:

* System stores complete history.

---

# 17. Related Requirements

| Requirement             | Reference |
| ----------------------- | --------- |
| Machine Management      | UCS-07    |
| Sensor Management       | UCS-08    |
| Telemetry Management    | UCS-09    |
| Incident Management     | UCS-11    |
| Notification Management | UCS-16    |
| Audit Log               | UCS-23    |

---

# Revision History

| Version | Date       | Author           | Description     |
| ------- | ---------- | ---------------- | --------------- |
| 1.0     | 2026-08-07 | Business Analyst | Initial version |