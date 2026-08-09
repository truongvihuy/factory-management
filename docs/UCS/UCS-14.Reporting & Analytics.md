# UCS-14. Reporting & Analytics

**Document Name:** Use Case Specification  
**Use Case ID:** UCS-14  
**Use Case Name:** Reporting & Analytics  
**Project:** Factory Management System (FMS)  
**Version:** 1.0  
**Status:** Draft

---

# 1. Use Case Overview

## 1.1 Description

The **Reporting & Analytics** use case describes how the Factory Management System generates operational reports and analytical information from collected factory data.

The system provides reports related to machines, telemetry, alerts, maintenance activities, incidents, and operational performance indicators.

The purpose of Reporting & Analytics is to:

- Provide historical operational insights.
- Support management decision-making.
- Evaluate machine performance.
- Analyze maintenance effectiveness.
- Monitor operational trends.
- Provide exportable reports.

---

# 2. Actors

| Actor                 | Description                                  |
| --------------------- | -------------------------------------------- |
| Director              | Reviews business performance and KPI reports |
| Factory Manager       | Reviews factory operational reports          |
| Production Supervisor | Reviews production line and machine reports  |
| Maintenance Planner   | Reviews maintenance performance              |
| Maintenance Engineer  | Reviews maintenance history                  |
| System                | Aggregates and generates reports             |

---

# 3. Use Case Scope

This use case covers:

- Generate operational reports.
- View analytical dashboards.
- Filter report data.
- Export reports.
- Review machine performance.
- Review maintenance performance.
- Review incident performance.
- Review energy consumption.
- Review KPI information.

This use case does not cover:

- Data collection.
- Telemetry ingestion.
- Dashboard real-time monitoring.
- Machine configuration.
- Maintenance execution.

Related use cases:

- UCS-07 Machine Management.
- UCS-09 Telemetry Management.
- UCS-10 Alert Management.
- UCS-11 Incident Management.
- UCS-12 Maintenance Management.
- UCS-13 Dashboard & Monitoring.

---

# 4. Preconditions

Before executing this use case:

1. User account must exist.
2. User must have reporting permission.
3. Required operational data must exist.
4. User must have access to selected factory.

---

# 5. Trigger

The use case is triggered when:

- User opens Reporting module.
- User requests a report.
- User selects analytical criteria.
- User exports report data.

---

# 6. Report Types

The system supports the following reports.

## 6.1 Machine Status Report

Provides:

- Total machines.
- Machine status distribution.
- Running machines.
- Offline machines.
- Error machines.
- Maintenance machines.

---

## 6.2 Maintenance Report

Provides:

- Maintenance activities.
- Maintenance frequency.
- Completed maintenance.
- Overdue maintenance.
- Maintenance history.

---

## 6.3 Incident Report

Provides:

- Incident count.
- Incident severity.
- Incident status.
- SLA performance.
- Resolution time.

---

## 6.4 Energy Consumption Report

Provides:

- Energy usage.
- Consumption trend.
- Machine energy data.
- Factory energy overview.

---

## 6.5 KPI Report

Provides operational indicators:

- Availability.
- Downtime.
- MTBF.
- MTTR.
- OEE.

---

# 7. Main Success Flow

# 7.1 Generate Report

| Step | Actor Action                | System Response                   |
| ---- | --------------------------- | --------------------------------- |
| 1    | User opens Reporting module | System displays available reports |
| 2    | User selects report type    | System displays filter options    |
| 3    | User enters filter criteria | System validates input            |
| 4    | User submits request        | System retrieves required data    |
| 5    | System processes data       | Report is generated               |
| 6    | System displays result      | User reviews information          |

---

# 7.2 Filter Report Data

| Step | Actor Action            | System Response                   |
| ---- | ----------------------- | --------------------------------- |
| 1    | User selects filters    | System displays available filters |
| 2    | User chooses criteria   | System validates access           |
| 3    | User confirms filter    | System retrieves matching data    |
| 4    | System refreshes report | Updated report is displayed       |

Supported filters:

- Company.
- Factory.
- Workshop.
- Production Line.
- Machine.
- Time range.
- Status.

---

# 7.3 Export Report

| Step | Actor Action          | System Response                |
| ---- | --------------------- | ------------------------------ |
| 1    | User selects Export   | System displays export options |
| 2    | User selects format   | System prepares report         |
| 3    | System generates file | Export file is created         |
| 4    | User downloads report | Report is provided             |

Supported formats:

- PDF.
- Excel.

---

# 7.4 Analyze Machine Performance

| Step | Actor Action                | System Response                      |
| ---- | --------------------------- | ------------------------------------ |
| 1    | User selects machine report | System retrieves machine data        |
| 2    | System calculates metrics   | Performance indicators are generated |
| 3    | User reviews result         | Machine performance is analyzed      |

---

# 7.5 Analyze Maintenance Performance

| Step | Actor Action                    | System Response                        |
| ---- | ------------------------------- | -------------------------------------- |
| 1    | User selects maintenance report | System retrieves maintenance data      |
| 2    | System aggregates information   | Maintenance statistics are calculated  |
| 3    | User reviews report             | Maintenance effectiveness is evaluated |

---

# 8. Alternative Flows

# AF-01 No Data Available

### Condition

No data exists for selected criteria.

Flow:

| Step | Actor Action         | System Response              |
| ---- | -------------------- | ---------------------------- |
| 1    | User requests report | System searches data         |
| 2    | No data found        | System displays empty result |
| 3    | User changes filter  | Report can be regenerated    |

---

# AF-02 Large Report Request

### Condition

Report contains large amount of data.

Flow:

| Step | Actor Action                | System Response            |
| ---- | --------------------------- | -------------------------- |
| 1    | User requests report        | System evaluates data size |
| 2    | Large dataset detected      | System processes request   |
| 3    | Report generation completed | User receives result       |

---

# AF-03 Restricted Data Access

### Condition

User requests unauthorized factory data.

Flow:

| Step | Actor Action             | System Response             |
| ---- | ------------------------ | --------------------------- |
| 1    | User selects factory     | System validates permission |
| 2    | Permission denied        | Data is excluded            |
| 3    | Access event is recorded | Audit log created           |

---

# 9. Exception Flows

# EF-01 Report Generation Failure

### Condition

System cannot generate report.

Flow:

| Step | Actor Action          | System Response       |
| ---- | --------------------- | --------------------- |
| 1    | User requests report  | System processes data |
| 2    | Processing fails      | Error detected        |
| 3    | System displays error | Failure is logged     |

---

# EF-02 Export Failure

### Condition

File generation fails.

Flow:

| Step | Actor Action         | System Response       |
| ---- | -------------------- | --------------------- |
| 1    | User exports report  | System generates file |
| 2    | File creation fails  | Error occurs          |
| 3    | System notifies user | Export can be retried |

---

# 10. Business Rules

## BR-RA-001 Data Visibility

Users can only generate reports from factories they have permission to access.

---

## BR-RA-002 Historical Data

Reports must use stored historical operational data.

---

## BR-RA-003 Report Filtering

Reports must support filtering by:

- Company.
- Factory.
- Workshop.
- Production Line.
- Machine.
- Time range.

---

## BR-RA-004 Report Accuracy

Generated reports must reflect the latest available system data.

---

## BR-RA-005 Export Format

The system supports:

- PDF export.
- Excel export.

---

## BR-RA-006 KPI Calculation

KPI values must be calculated based on available operational data.

Supported KPI:

- Availability.
- MTBF.
- MTTR.
- OEE.

---

# 11. Data Requirements

## Report Entity

| Field        | Description       |
| ------------ | ----------------- |
| Report ID    | Unique identifier |
| Report Type  | Report category   |
| User ID      | Requesting user   |
| Factory ID   | Data scope        |
| Created Time | Generation time   |
| Status       | Report status     |

---

## Report Filter Entity

| Field      | Description       |
| ---------- | ----------------- |
| Filter ID  | Unique identifier |
| Report ID  | Related report    |
| Time Range | Selected period   |
| Factory    | Factory scope     |
| Machine    | Machine scope     |

---

# 12. Input Requirements

| Input           | Required |
| --------------- | -------- |
| User ID         | Yes      |
| Report Type     | Yes      |
| Factory ID      | Yes      |
| Time Range      | Optional |
| Filter Criteria | Optional |
| Export Format   | Optional |

---

# 13. Output Requirements

The system provides:

- Generated reports.
- KPI information.
- Analytical results.
- Export files.
- Historical operational data.

---

# 14. Postconditions

## Successful Execution

After completion:

- Report is generated.
- Analytical information is available.
- Export file is created if requested.

---

## Failed Execution

After failure:

- Error is recorded.
- Original data remains unchanged.
- User receives failure notification.

---

# 15. Acceptance Criteria

## AC-01 Generate Machine Report

Given:

- Machine data exists.

When:

- User requests machine report.

Then:

- System generates machine status report.

---

## AC-02 Generate Maintenance Report

Given:

- Maintenance records exist.

When:

- User requests maintenance report.

Then:

- System displays maintenance information.

---

## AC-03 Export Report

Given:

- Report has been generated.

When:

- User exports PDF or Excel.

Then:

- System creates export file successfully.

---

## AC-04 Filter Report

Given:

- User has factory permission.

When:

- User applies filters.

Then:

- Report displays filtered information.

---

## AC-05 KPI Analysis

Given:

- Operational data exists.

When:

- User views KPI report.

Then:

- KPI values are displayed.

---

# 16. Related Requirements

| Requirement            | Reference |
| ---------------------- | --------- |
| Machine Management     | UCS-07    |
| Telemetry Management   | UCS-09    |
| Alert Management       | UCS-10    |
| Incident Management    | UCS-11    |
| Maintenance Management | UCS-12    |
| Dashboard & Monitoring | UCS-13    |
| Audit Log              | UCS-23    |

---

# Revision History

| Version | Date       | Author           | Description     |
| ------- | ---------- | ---------------- | --------------- |
| 1.0     | 2026-08-07 | Business Analyst | Initial version |
