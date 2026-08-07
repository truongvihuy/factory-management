# SRS-08. Assumptions & Constraints

**Document Name:** Software Requirements Specification (SRS)  
**Section:** SRS-08 Assumptions & Constraints  
**Project:** Factory Management System (FMS)  
**Version:** 1.0  
**Status:** Draft  

---

# 8. Assumptions & Constraints

## 8.1 Overview

This document defines the assumptions and constraints applied to the **Factory Management System (FMS)**.

Assumptions describe conditions considered valid during system design and implementation.

Constraints describe limitations, restrictions, and mandatory boundaries that the system must follow.

This section ensures that all stakeholders have a consistent understanding of the system operating environment.

---

# 8.2 Assumptions

## 8.2.1 Business Structure Assumptions

### ASSUMP-001 Organization Hierarchy

The system assumes factories follow a standardized organizational structure.

The hierarchy is:

```text
Company
    |
    └── Factory
            |
            └── Workshop
                    |
                    └── Production Line
                            |
                            └── Machine
                                    |
                                    └── Sensor
````

---

### ASSUMP-002 Company Ownership

The system assumes:

* One Company can own multiple Factories.
* Each Factory belongs to one Company.

---

### ASSUMP-003 Factory Structure

The system assumes:

* One Factory can contain multiple Workshops.
* One Workshop can contain multiple Production Lines.
* One Production Line can contain multiple Machines.

---

# 8.3 Machine Management Assumptions

## ASSUMP-004 Machine Assignment

The system assumes:

* Each Machine belongs to only one Production Line at any point in time.
* Machine relocation is an occasional business activity.

---

## ASSUMP-005 Machine Information Accuracy

The system assumes users provide accurate machine information.

Required information includes:

* Machine Code.
* Machine Name.
* Machine Type.
* Manufacturer.
* Serial Number.
* Installation Information.

---

## ASSUMP-006 Machine Lifecycle

The system assumes machines follow a defined lifecycle:

```text
Draft
 |
Installed
 |
Running
 |
Maintenance
 |
Retired
```

---

# 8.4 Sensor Management Assumptions

## ASSUMP-007 Sensor Assignment

The system assumes:

* Each Sensor belongs to one Machine at a time.
* Sensor replacement occurs periodically.
* Sensor assignment history must be preserved.

---

## ASSUMP-008 Sensor Data Availability

The system assumes sensors:

* Continuously collect operational data.
* Provide valid measurement values.
* Have unique identifiers.

---

# 8.5 Telemetry Assumptions

## ASSUMP-009 Telemetry Availability

The system assumes:

* Machines continuously transmit telemetry data.
* Gateway devices collect and forward telemetry.
* Network interruptions may occur.

---

## ASSUMP-010 Gateway Buffering

The system assumes gateways are responsible for:

* Temporary data buffering.
* Data forwarding after network recovery.

---

## ASSUMP-011 Supported Industrial Protocols

The system assumes industrial devices support:

* MQTT.
* OPC-UA.
* Modbus TCP.

---

# 8.6 User and Security Assumptions

## ASSUMP-012 User Account Management

The system assumes:

* Users have valid accounts before accessing the system.
* User information is maintained by administrators.

---

## ASSUMP-013 Authorization Model

The system assumes:

* User access is controlled at Factory level.
* Users may have access to multiple Factories.
* Users receive appropriate roles before operation.

---

## ASSUMP-014 Authentication

The MVP assumes:

* Local Account authentication is used.
* External identity providers are not required.

---

# 8.7 Maintenance Assumptions

## ASSUMP-015 Maintenance Process

The system assumes:

* Maintenance activities follow defined workflows.
* Maintenance engineers are assigned before execution.
* Completed maintenance records are retained.

---

## ASSUMP-016 Maintenance Data

The system assumes users provide:

* Maintenance schedule.
* Checklist information.
* Completion results.
* Maintenance notes.

---

# 8.8 Reporting Assumptions

## ASSUMP-017 Operational Data Availability

The system assumes:

* Required operational data exists before generating reports.
* Historical data is available for analysis.

---

## ASSUMP-018 KPI Calculation

The system assumes KPI calculations depend on:

* Machine status.
* Telemetry data.
* Maintenance records.
* Incident records.

---

# 8.9 Constraints

## 8.10 Technical Constraints

### CONST-001 Authentication Constraint

The MVP supports only:

* Local Account authentication.

External authentication systems are not included.

---

### CONST-002 Historical Data Constraint

The system shall enforce:

* Historical telemetry cannot be modified.
* Historical assignment records cannot be deleted.
* Maintenance history cannot be deleted.
* Incident history cannot be deleted.

---

### CONST-003 Machine Relationship Constraint

The system shall enforce:

* One Machine belongs to one Production Line at a time.

---

### CONST-004 Sensor Relationship Constraint

The system shall enforce:

* One Sensor belongs to one Machine at a time.

---

# 8.11 Business Scope Constraints

## CONST-005 Production Management

The MVP does not support:

* Production Orders.
* Production Planning.
* Production Scheduling.
* Production Execution.

---

## CONST-006 Manufacturing Execution System

The MVP does not include:

* Manufacturing workflow.
* Work instructions.
* Process tracking.

---

## CONST-007 Quality Management

The MVP does not include:

* Quality inspection.
* Quality control.
* Reject analysis.

---

## CONST-008 Warehouse Management

The MVP does not include:

* Inventory management.
* Material tracking.
* Warehouse operation.

---

## CONST-009 ERP Integration

The MVP does not include:

* SAP integration.
* Oracle ERP integration.
* Other ERP systems.

---

# 8.12 Data Constraints

## CONST-010 Telemetry Retention

The system shall apply:

| Data Type     | Retention |
| ------------- | --------- |
| Raw Telemetry | 6 Months  |
| Summary Data  | 5 Years   |

---

## CONST-011 Data Immutability

The following data shall be immutable:

* Telemetry data.
* Assignment history.
* Maintenance history.
* Incident history.
* Audit logs.

---

# 8.13 Operational Constraints

## CONST-012 Real-Time Monitoring

The system shall provide:

* Near real-time machine status.
* Near real-time alert updates.

---

## CONST-013 Network Dependency

The system depends on:

* Stable network connectivity.
* Gateway communication.
* Industrial device availability.

---

## CONST-014 Data Quality

The system depends on:

* Accurate machine configuration.
* Correct sensor assignment.
* Correct alert threshold configuration.

---

# 8.14 Security Constraints

## CONST-015 Access Control

The system shall enforce:

* User authentication.
* Role-based permissions.
* Factory-level data isolation.

---

## CONST-016 Audit Requirement

The system shall record:

* User activities.
* Configuration changes.
* Permission changes.

Audit records shall not be modified by normal users.

---

# 8.15 Assumption and Constraint Traceability

| Category       | Related Section                |
| -------------- | ------------------------------ |
| Organization   | SRS-03 Functional Requirements |
| Machine        | SRS-03 Functional Requirements |
| Sensor         | SRS-03 Functional Requirements |
| Telemetry      | SRS-03 Functional Requirements |
| Maintenance    | SRS-03 Functional Requirements |
| Incident       | SRS-03 Functional Requirements |
| Security       | SRS-07 Business Rules          |
| Data Retention | SRS-07 Business Rules          |

---

# Revision History

| Version | Date       | Author           | Description     |
| ------- | ---------- | ---------------- | --------------- |
| 1.0     | 2026-08-07 | Business Analyst | Initial version |
