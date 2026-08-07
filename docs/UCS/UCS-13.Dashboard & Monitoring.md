# UCS-13. Dashboard & Monitoring

**Document Name:** Use Case Specification  
**Use Case ID:** UCS-13  
**Use Case Name:** Dashboard & Monitoring  
**Project:** Factory Management System (FMS)  
**Version:** 1.0  
**Status:** Draft  

---

# 1. Use Case Overview

## 1.1 Description

The **Dashboard & Monitoring** use case describes how the Factory Management System provides real-time operational visibility of factories, workshops, production lines, machines, telemetry data, alerts, maintenance activities, and incidents.

The dashboard aggregates operational data from multiple system modules and presents information through visual monitoring interfaces.

The purpose of Dashboard & Monitoring is to:

- Provide real-time visibility into factory operations.
- Monitor machine operational status.
- Identify abnormal machine conditions.
- Support operational decision-making.
- Provide overview of alerts, incidents, and maintenance activities.
- Improve response time to operational issues.

---

# 2. Actors

| Actor | Description |
| --- | --- |
| Factory Manager | Monitors overall factory performance |
| Production Supervisor | Monitors workshops and production lines |
| Maintenance Engineer | Reviews machine conditions and maintenance status |
| Operator | Monitors assigned machines |
| Director | Reviews operational overview and KPIs |
| System | Collects and displays operational data |

---

# 3. Use Case Scope

This use case covers:

- View factory dashboard.
- View workshop dashboard.
- View production line dashboard.
- View machine monitoring dashboard.
- Monitor real-time machine status.
- View telemetry values.
- View active alerts.
- View maintenance summary.
- View incident summary.
- Filter monitoring data.
- Refresh dashboard information.

This use case does not cover:

- Telemetry ingestion.
- Alert generation.
- Machine registration.
- Maintenance execution.
- Report generation.

Related use cases:

- UCS-04 Factory Management.
- UCS-06 Production Line Management.
- UCS-07 Machine Management.
- UCS-09 Telemetry Management.
- UCS-10 Alert Management.
- UCS-11 Incident Management.
- UCS-12 Maintenance Management.
- UCS-14 Reporting & Analytics.

---

# 4. Preconditions

Before executing this use case:

1. User account must exist.
2. User must have dashboard permission.
3. Factory structure must be configured.
4. Machines must exist.
5. Telemetry data must be available.
6. User must have access to selected factory.

---

# 5. Trigger

The use case is triggered when:

- User accesses dashboard.
- User selects factory monitoring view.
- User selects machine monitoring view.
- User refreshes dashboard data.
- System receives new operational data.

---

# 6. Dashboard Levels

The system supports monitoring at multiple levels.

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
                               │
                               └── Sensor
````

---

# 7. Main Success Flow

# 7.1 View Factory Dashboard

| Step | Actor Action                             | System Response             |
| ---- | ---------------------------------------- | --------------------------- |
| 1    | User opens dashboard                     | System validates permission |
| 2    | User selects factory                     | System loads factory data   |
| 3    | System retrieves operational information | Dashboard is displayed      |
| 4    | User reviews information                 | Factory status is monitored |

Dashboard displays:

* Total machines.
* Running machines.
* Offline machines.
* Error machines.
* Active alerts.
* Maintenance activities.
* Incident summary.

---

# 7.2 View Machine Monitoring Dashboard

| Step | Actor Action                      | System Response                  |
| ---- | --------------------------------- | -------------------------------- |
| 1    | User selects machine              | System loads machine information |
| 2    | System retrieves latest telemetry | Current values are displayed     |
| 3    | System displays machine status    | User monitors condition          |
| 4    | User reviews alerts               | Active issues are displayed      |

Machine monitoring includes:

* Machine status.
* Sensor status.
* Latest telemetry.
* Alert status.
* Maintenance history summary.
* Incident history summary.

---

# 7.3 Monitor Real-time Telemetry

| Step | Actor Action                    | System Response                 |
| ---- | ------------------------------- | ------------------------------- |
| 1    | User opens monitoring screen    | System connects monitoring data |
| 2    | New telemetry arrives           | System updates dashboard        |
| 3    | System refreshes values         | Latest data is displayed        |
| 4    | User observes machine condition | Operational status is monitored |

---

# 7.4 Filter Dashboard Data

| Step | Actor Action                       | System Response                |
| ---- | ---------------------------------- | ------------------------------ |
| 1    | User selects filter criteria       | System receives filter request |
| 2    | System validates access permission | Data scope is determined       |
| 3    | System loads filtered information  | Dashboard is updated           |

Supported filters:

* Company.
* Factory.
* Workshop.
* Production Line.
* Machine.
* Time range.
* Status.

---

# 7.5 View Active Alerts

| Step | Actor Action            | System Response                |
| ---- | ----------------------- | ------------------------------ |
| 1    | User opens alert widget | System retrieves active alerts |
| 2    | System displays alerts  | Severity is shown              |
| 3    | User selects alert      | Alert details are displayed    |

Displayed information:

* Alert severity.
* Machine.
* Alert type.
* Created time.
* Current status.

---

# 7.6 View Maintenance Summary

| Step | Actor Action                  | System Response                   |
| ---- | ----------------------------- | --------------------------------- |
| 1    | User opens maintenance widget | System retrieves maintenance data |
| 2    | System aggregates information | Summary is displayed              |

Displayed information:

* Planned maintenance.
* In-progress maintenance.
* Completed maintenance.
* Overdue maintenance.

---

# 7.7 View Incident Summary

| Step | Actor Action               | System Response            |
| ---- | -------------------------- | -------------------------- |
| 1    | User opens incident widget | System retrieves incidents |
| 2    | System calculates summary  | Information is displayed   |

Displayed information:

* Open incidents.
* Critical incidents.
* Resolved incidents.
* SLA violations.

---

# 8. Alternative Flows

# AF-01 No Telemetry Available

### Condition

Machine has no recent telemetry.

Flow:

| Step | Actor Action                 | System Response                    |
| ---- | ---------------------------- | ---------------------------------- |
| 1    | User opens machine dashboard | System checks telemetry            |
| 2    | No data found                | System displays unavailable status |
| 3    | User receives warning        | Monitoring continues               |

---

# AF-02 User Has Multiple Factory Access

### Condition

User can access multiple factories.

Flow:

| Step | Actor Action                      | System Response                   |
| ---- | --------------------------------- | --------------------------------- |
| 1    | User opens dashboard              | System loads accessible factories |
| 2    | User selects factory              | System filters data               |
| 3    | Dashboard displays selected scope | Data is restricted                |

---

# AF-03 Machine Offline

### Condition

Machine stops sending telemetry.

Flow:

| Step | Actor Action                     | System Response              |
| ---- | -------------------------------- | ---------------------------- |
| 1    | System detects missing telemetry | Machine status evaluated     |
| 2    | Status changes                   | Machine displayed as Offline |
| 3    | Dashboard updates                | User sees abnormal condition |

---

# 9. Exception Flows

# EF-01 Dashboard Data Loading Failure

### Condition

Required data cannot be retrieved.

Flow:

| Step | Actor Action                  | System Response   |
| ---- | ----------------------------- | ----------------- |
| 1    | User requests dashboard       | System loads data |
| 2    | Data retrieval fails          | Error is detected |
| 3    | System displays error message | Failure is logged |

---

# EF-02 Unauthorized Access

### Condition

User accesses unavailable factory.

Flow:

| Step | Actor Action            | System Response          |
| ---- | ----------------------- | ------------------------ |
| 1    | User selects factory    | System checks permission |
| 2    | Permission denied       | Access rejected          |
| 3    | Security event recorded | Audit log created        |

---

# 10. Business Rules

## BR-DM-001 Data Visibility

Users can only view data belonging to assigned factories.

---

## BR-DM-002 Real-time Monitoring

Dashboard must display the latest available machine information.

---

## BR-DM-003 Machine Status

Machine status includes:

```text
Running
Idle
Maintenance
Offline
Error
Retired
```

---

## BR-DM-004 Telemetry Display

Dashboard displays latest telemetry values collected from sensors.

Example:

```text
Machine A

Temperature: 75°C
Vibration: 2.5 mm/s
Power: 10 kW
Status: Running
```

---

## BR-DM-005 Alert Visibility

Active alerts must be visible according to:

* User permission.
* Factory access.
* Alert severity.

---

## BR-DM-006 Dashboard History

Historical operational data must remain available for analysis.

---

# 11. Data Requirements

## Dashboard Summary Entity

| Field               | Description             |
| ------------------- | ----------------------- |
| Dashboard ID        | Unique identifier       |
| Factory ID          | Factory scope           |
| Total Machines      | Number of machines      |
| Running Machines    | Active machines         |
| Offline Machines    | Offline machines        |
| Active Alerts       | Current alerts          |
| Maintenance Summary | Maintenance information |
| Incident Summary    | Incident information    |

---

## Machine Monitoring Data

| Field             | Description         |
| ----------------- | ------------------- |
| Machine ID        | Related machine     |
| Status            | Current status      |
| Telemetry Value   | Latest values       |
| Last Updated Time | Data timestamp      |
| Alert Status      | Current alert state |

---

# 12. Input Requirements

| Input              | Required |
| ------------------ | -------- |
| User ID            | Yes      |
| Factory ID         | Yes      |
| Workshop ID        | Optional |
| Production Line ID | Optional |
| Machine ID         | Optional |
| Time Range         | Optional |

---

# 13. Output Requirements

The system provides:

* Factory dashboard.
* Workshop dashboard.
* Production line dashboard.
* Machine dashboard.
* Real-time telemetry view.
* Alert overview.
* Maintenance summary.
* Incident summary.

---

# 14. Postconditions

## Successful Execution

After completion:

* Dashboard information is displayed.
* User can monitor operational status.
* Latest machine information is available.

---

## Failed Execution

After failure:

* Error is recorded.
* Existing operational data remains unchanged.
* User receives appropriate notification.

---

# 15. Acceptance Criteria

## AC-01 View Factory Dashboard

Given:

* User has factory access.

When:

* User opens dashboard.

Then:

* Factory operational information is displayed.

---

## AC-02 View Machine Status

Given:

* Machine exists.

When:

* User opens machine monitoring.

Then:

* Current machine status is displayed.

---

## AC-03 Display Telemetry

Given:

* Machine has telemetry data.

When:

* User opens monitoring page.

Then:

* Latest telemetry values are displayed.

---

## AC-04 Display Alerts

Given:

* Active alerts exist.

When:

* User views dashboard.

Then:

* Active alerts are displayed.

---

## AC-05 Restrict Data Access

Given:

* User does not have factory permission.

When:

* User accesses dashboard.

Then:

* System denies access.

---

# 16. Related Requirements

| Requirement                | Reference |
| -------------------------- | --------- |
| Factory Management         | UCS-04    |
| Production Line Management | UCS-06    |
| Machine Management         | UCS-07    |
| Sensor Management          | UCS-08    |
| Telemetry Management       | UCS-09    |
| Alert Management           | UCS-10    |
| Incident Management        | UCS-11    |
| Maintenance Management     | UCS-12    |
| Reporting & Analytics      | UCS-14    |
| Audit Log                  | UCS-23    |

---

# Revision History

| Version | Date       | Author           | Description     |
| ------- | ---------- | ---------------- | --------------- |
| 1.0     | 2026-08-07 | Business Analyst | Initial version |