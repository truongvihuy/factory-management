# UCS-12. Maintenance Management

**Document Name:** Use Case Specification  
**Use Case ID:** UCS-12  
**Use Case Name:** Maintenance Management  
**Project:** Factory Management System (FMS)  
**Version:** 1.0  
**Status:** Draft  

---

# 1. Use Case Overview

## 1.1 Description

The **Maintenance Management** use case describes how the Factory Management System manages maintenance activities for industrial machines throughout their operational lifecycle.

The system supports planned and unplanned maintenance activities, including preventive maintenance, corrective maintenance, and predictive maintenance.

The purpose of Maintenance Management is to:

- Standardize maintenance processes.
- Reduce machine downtime.
- Improve equipment reliability.
- Track maintenance activities.
- Maintain complete maintenance history.
- Support maintenance planning and execution.

---

# 2. Actors

| Actor | Description |
| --- | --- |
| System | Generates maintenance activities based on schedules or machine conditions |
| Maintenance Planner | Creates and manages maintenance schedules |
| Maintenance Engineer | Executes maintenance activities |
| Factory Manager | Approves and monitors maintenance activities |
| Production Supervisor | Coordinates machine availability |
| Operator | Reports machine issues and supports maintenance activities |

---

# 3. Use Case Scope

This use case covers:

- Create maintenance schedules.
- Approve maintenance plans.
- Generate work orders.
- Assign maintenance engineers.
- Execute maintenance tasks.
- Complete maintenance checklists.
- Record spare parts usage.
- Record maintenance costs.
- Verify maintenance completion.
- Close work orders.
- Maintain maintenance history.

This use case does not cover:

- Inventory management.
- Purchasing process.
- Financial accounting.
- Machine registration.
- Sensor management.

Related use cases:

- UCS-07 Machine Management.
- UCS-09 Telemetry Management.
- UCS-10 Alert Management.
- UCS-11 Incident Management.
- UCS-13 Spare Part Inventory Management.

---

# 4. Preconditions

Before executing this use case:

1. Machine must exist.
2. Machine must be active.
3. Maintenance user must have permission.
4. Maintenance checklist must be available.
5. Technician must exist.
6. Required machine information must be available.

---

# 5. Trigger

The use case is triggered when:

- Scheduled maintenance date is reached.
- Machine requires corrective maintenance.
- Predictive analysis detects potential failure.
- Incident requires maintenance action.
- User manually creates maintenance activity.

---

# 6. Maintenance Types

The system supports:

| Type | Description |
| --- | --- |
| Preventive Maintenance | Planned maintenance performed periodically |
| Corrective Maintenance | Maintenance performed after equipment failure |
| Predictive Maintenance | Maintenance based on machine condition data |

---

# 7. Maintenance Lifecycle

```text
Draft
 │
 ▼
Pending Approval
 │
 ▼
Approved
 │
 ▼
Assigned
 │
 ▼
In Progress
 │
 ▼
Completed
 │
 ▼
Verified
 │
 ▼
Closed
```

---

# 8. Main Success Flow

# 8.1 Create Maintenance Schedule

| Step | Actor Action | System Response |
| --- | --- | --- |
| 1 | Planner opens Maintenance Management | System displays maintenance schedules |
| 2 | Planner creates schedule | System displays maintenance form |
| 3 | Planner enters information | System validates input |
| 4 | Planner selects machine | System links schedule to machine |
| 5 | Planner submits schedule | System creates maintenance plan |
| 6 | System records activity | Audit history is created |

---

# 8.2 Approve Maintenance Schedule

| Step | Actor Action | System Response |
| --- | --- | --- |
| 1 | Manager reviews maintenance plan | System displays details |
| 2 | Manager approves schedule | System updates status |
| 3 | System activates schedule | Future work orders can be generated |

---

# 8.3 Generate Work Order

| Step | Actor Action | System Response |
| --- | --- | --- |
| 1 | Maintenance schedule reaches planned date | System creates work order |
| 2 | System assigns machine information | Work order is linked |
| 3 | System sets priority | Work order priority is calculated |
| 4 | System assigns status | Status becomes Assigned |

---

# 8.4 Assign Maintenance Engineer

| Step | Actor Action | System Response |
| --- | --- | --- |
| 1 | Planner selects engineer | System validates user permission |
| 2 | Planner confirms assignment | Engineer is assigned |
| 3 | System updates work order | Status becomes Assigned |
| 4 | System records assignment history | Assignment is stored |

---

# 8.5 Execute Maintenance

| Step | Actor Action | System Response |
| --- | --- | --- |
| 1 | Engineer starts work order | Status changes to In Progress |
| 2 | Engineer performs maintenance | Activities are recorded |
| 3 | Engineer completes checklist | Checklist results are stored |
| 4 | Engineer records notes | Maintenance information is updated |

---

# 8.6 Record Spare Parts Usage

| Step | Actor Action | System Response |
| --- | --- | --- |
| 1 | Engineer selects used spare parts | System displays available parts |
| 2 | Engineer enters quantity | System validates data |
| 3 | System records usage | Spare part usage history is stored |

---

# 8.7 Complete Maintenance Work Order

| Step | Actor Action | System Response |
| --- | --- | --- |
| 1 | Engineer completes tasks | Completion information is entered |
| 2 | Engineer submits work order | System validates checklist |
| 3 | System updates status | Status becomes Completed |
| 4 | System stores maintenance history | Historical record created |

---

# 8.8 Verify and Close Work Order

| Step | Actor Action | System Response |
| --- | --- | --- |
| 1 | Manager reviews completion | System displays results |
| 2 | Manager verifies maintenance | Verification recorded |
| 3 | User closes work order | Status becomes Closed |
| 4 | System updates machine history | Maintenance record finalized |

---

# 9. Alternative Flows

# AF-01 Emergency Maintenance

### Condition

Machine failure requires immediate repair.

Flow:

| Step | Actor Action | System Response |
| --- | --- | --- |
| 1 | User reports failure | System creates corrective maintenance |
| 2 | Priority is set to Critical | Work order created immediately |
| 3 | Engineer is assigned | Maintenance begins |

---

# AF-02 Maintenance Rescheduled

### Condition

Planned maintenance cannot be performed.

Flow:

| Step | Actor Action | System Response |
| --- | --- | --- |
| 1 | Planner changes schedule | System validates new date |
| 2 | Schedule updated | History recorded |

---

# AF-03 Maintenance Rejected

### Condition

Approval is rejected.

Flow:

| Step | Actor Action | System Response |
| --- | --- | --- |
| 1 | Manager reviews schedule | Approval rejected |
| 2 | System updates status | Schedule returns to Draft |
| 3 | Reason is stored | Rejection history recorded |

---

# 10. Exception Flows

# EF-01 Engineer Unavailable

### Condition

Assigned engineer cannot execute maintenance.

Flow:

| Step | Actor Action | System Response |
| --- | --- | --- |
| 1 | Work order assigned | System detects unavailable user |
| 2 | Assignment fails | System requests reassignment |

---

# EF-02 Checklist Incomplete

### Condition

Maintenance checklist is incomplete.

Flow:

| Step | Actor Action | System Response |
| --- | --- | --- |
| 1 | Engineer submits work order | System validates checklist |
| 2 | Missing items detected | Submission rejected |
| 3 | Engineer completes checklist | Work order continues |

---

# 11. Business Rules

## BR-MT-001 Maintenance Association

Every maintenance activity must belong to one machine.

```text
Machine
   │
   ├── Maintenance Schedule
   │
   └── Work Order
```

---

## BR-MT-002 Maintenance Approval

Maintenance schedules require approval before generating planned work orders.

---

## BR-MT-003 Work Order Lifecycle

Work order status must follow:

```text
Draft
Pending Approval
Approved
Assigned
In Progress
Completed
Verified
Closed
```

---

## BR-MT-004 Maintenance Checklist

Every completed maintenance work order must include:

- Inspection items.
- Result.
- Technician.
- Completion note.
- Attachment (optional).

---

## BR-MT-005 Maintenance History

The system must maintain:

- Maintenance type.
- Technician.
- Completion date.
- Checklist result.
- Spare parts used.
- Notes.

---

## BR-MT-006 Maintenance Data Integrity

Completed maintenance records cannot be deleted.

---

## BR-MT-007 Machine Availability

Maintenance activities may affect machine operational status.

Example:

```text
Running
   ↓
Maintenance
   ↓
Running
```

---

# 12. Data Requirements

## Maintenance Schedule Entity

| Field | Description |
| --- | --- |
| Schedule ID | Unique identifier |
| Machine ID | Related machine |
| Maintenance Type | Preventive/Corrective/Predictive |
| Planned Date | Scheduled date |
| Frequency | Maintenance interval |
| Status | Schedule status |

---

## Work Order Entity

| Field | Description |
| --- | --- |
| Work Order ID | Unique identifier |
| Machine ID | Related machine |
| Schedule ID | Related schedule |
| Maintenance Type | Maintenance category |
| Priority | Work priority |
| Assigned User | Technician |
| Status | Lifecycle status |
| Created Date | Creation date |
| Completed Date | Completion date |

---

## Maintenance Checklist Entity

| Field | Description |
| --- | --- |
| Checklist ID | Unique identifier |
| Work Order ID | Related work order |
| Item | Inspection item |
| Result | Inspection result |
| Note | Additional information |

---

# 13. Input Requirements

| Input | Required |
| --- | --- |
| Machine ID | Yes |
| Maintenance Type | Yes |
| Planned Date | Yes |
| Technician | Optional |
| Checklist | Yes |
| Spare Parts | Optional |
| Notes | Optional |

---

# 14. Output Requirements

The system provides:

- Maintenance schedules.
- Work orders.
- Maintenance history.
- Checklist results.
- Spare part usage.
- Maintenance reports.

---

# 15. Postconditions

## Successful Execution

After completion:

- Maintenance activity is recorded.
- Machine history is updated.
- Work order is closed.
- Maintenance records are preserved.

---

## Failed Execution

After failure:

- Work order remains unchanged.
- Error is recorded.
- Existing maintenance history is protected.

---

# 16. Acceptance Criteria

## AC-01 Create Maintenance Schedule

Given:

- Machine exists.

When:

- Planner creates maintenance schedule.

Then:

- System stores schedule successfully.

---

## AC-02 Generate Work Order

Given:

- Approved maintenance schedule exists.

When:

- Planned date is reached.

Then:

- System generates work order.

---

## AC-03 Complete Maintenance

Given:

- Work order is assigned.

When:

- Engineer completes checklist.

Then:

- Work order changes to Completed.

---

## AC-04 Verify Maintenance

Given:

- Maintenance is completed.

When:

- Manager verifies result.

Then:

- Work order changes to Verified.

---

## AC-05 Maintain History

Given:

- Maintenance is completed.

When:

- User views machine history.

Then:

- Maintenance record is displayed.

---

# 17. Related Requirements

| Requirement | Reference |
| --- | --- |
| Machine Management | UCS-07 |
| Telemetry Management | UCS-09 |
| Alert Management | UCS-10 |
| Incident Management | UCS-11 |
| Spare Part Inventory Management | UCS-13 |
| Reporting & Analytics | UCS-15 |
| Audit Log | UCS-23 |

---

# Revision History

| Version | Date | Author | Description |
| --- | --- | --- | --- |
| 1.0 | 2026-08-07 | Business Analyst | Initial version |