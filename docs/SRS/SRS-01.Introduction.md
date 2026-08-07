# SRS-01. Introduction

**Document Name:** Software Requirements Specification (SRS)  
**Section:** SRS-01 Introduction  
**Project:** Factory Management System (FMS)  
**Version:** 1.0  
**Status:** Draft

---

# 1. Introduction

## 1.1 Purpose

This Software Requirements Specification (SRS) defines the complete software requirements for the **Factory Management System (FMS)**.

The purpose of this document is to provide a clear and shared understanding of the system requirements among all project stakeholders, including business users, developers, testers, architects, project managers, and maintenance teams.

This document serves as the baseline for:

- Software design
- System implementation
- Testing
- Deployment
- Maintenance
- Future enhancements

The SRS describes **what the software shall do** and **the constraints under which it shall operate**, without defining implementation details.

---

## 1.2 Scope

The Factory Management System (FMS) is an enterprise application designed to monitor and manage industrial assets across multiple companies and factories.

The system provides centralized management of organizational structures, industrial machines, IoT sensors, maintenance activities, operational incidents, alerts, and real-time telemetry data.

The MVP includes the following business capabilities:

- Organization Management
- Machine Management
- Sensor Management
- Telemetry Monitoring
- Alert Management
- Maintenance Management
- Incident Management
- User & Authorization Management
- Dashboard
- Reporting
- Audit Logging

The following capabilities are outside the scope of the MVP:

- Production Management
- Manufacturing Execution System (MES)
- Quality Management
- Warehouse Management
- ERP Integration
- Financial Management

---

## 1.3 Objectives

The Factory Management System aims to achieve the following objectives:

- Reduce machine downtime.
- Detect equipment abnormalities as early as possible.
- Improve machine availability.
- Standardize maintenance processes.
- Improve operational visibility.
- Support data-driven decision making.
- Reduce maintenance costs.
- Reduce energy consumption.
- Build a scalable platform for future business growth.

---

## 1.4 Intended Audience

This document is intended for the following stakeholders.

| Stakeholder | Purpose |
|--------------|---------|
| Product Owner | Validate software requirements |
| Business Analyst | Maintain and refine requirements |
| Solution Architect | Design system architecture |
| Software Architect | Define technical architecture |
| Backend Developer | Implement business logic and APIs |
| Frontend Developer | Develop user interfaces |
| QA Engineer | Create test plans and test cases |
| DevOps Engineer | Deploy and operate the system |
| Project Manager | Manage project scope and delivery |
| Support Team | Maintain production environments |

---

## 1.5 Product Overview

The Factory Management System is an IoT-enabled enterprise platform that continuously collects telemetry from industrial machines, monitors equipment health, generates alerts for abnormal conditions, and supports maintenance and incident management.

The platform provides centralized monitoring across multiple companies and factories while preserving complete historical records of operational activities.

The system supports near real-time monitoring and long-term operational analysis through dashboards and reports.

---

## 1.6 Business Context

The system operates within an industrial manufacturing environment.

High-level business structure:

```text
Company
│
├── Factory
│
├──── Workshop
│
├──────── Production Line
│
├──────────── Machine
│
├──────────────── Sensor
│
└──────────────────── Telemetry
```

Machine telemetry is continuously collected and analyzed to detect abnormal operating conditions and support maintenance activities.

---

## 1.7 Key Features

### Organization Management

- Company Management
- Factory Management
- Workshop Management
- Production Line Management

### Asset Management

- Machine Registration
- Machine Assignment
- Machine Lifecycle Management
- Sensor Assignment
- Sensor Lifecycle Management

### Monitoring

- Real-time Telemetry Collection
- Machine Health Monitoring
- Historical Telemetry
- Dashboard Monitoring

### Alert Management

- Threshold Monitoring
- Alert Generation
- Alert Notification
- Alert Acknowledgement
- Alert Escalation

### Maintenance Management

- Preventive Maintenance
- Corrective Maintenance
- Predictive Maintenance
- Maintenance Scheduling
- Work Orders
- Maintenance Checklist
- Spare Part Tracking

### Incident Management

- Incident Tracking
- SLA Monitoring
- Major Incident Management

### Reporting

- Operational Dashboard
- Machine Reports
- Maintenance Reports
- Incident Reports
- Energy Reports
- KPI Dashboard

---

## 1.8 Definitions

| Term | Definition |
|------|------------|
| Company | Organization that owns one or more factories |
| Factory | Manufacturing facility |
| Workshop | Production area inside a factory |
| Production Line | Group of machines performing a manufacturing process |
| Machine | Industrial equipment monitored by the system |
| Sensor | IoT device attached to a machine |
| Gateway | Device that collects and forwards telemetry from machines |
| Telemetry | Real-time operational data collected from machines |
| Alert | Notification generated when business rules detect abnormal conditions |
| Incident | Operational issue requiring investigation and resolution |
| Maintenance | Planned or unplanned work performed on a machine |
| Work Order | Task assigned for maintenance execution |
| KPI | Key Performance Indicator |
| OEE | Overall Equipment Effectiveness |
| MTBF | Mean Time Between Failures |
| MTTR | Mean Time To Repair |
| SLA | Service Level Agreement |

---

## 1.9 Acronyms

| Acronym | Meaning |
|----------|---------|
| API | Application Programming Interface |
| BRD | Business Requirements Document |
| CRUD | Create, Read, Update, Delete |
| CSV | Comma-Separated Values |
| ERP | Enterprise Resource Planning |
| FMS | Factory Management System |
| HTTP | Hypertext Transfer Protocol |
| IoT | Internet of Things |
| JSON | JavaScript Object Notation |
| JWT | JSON Web Token |
| KPI | Key Performance Indicator |
| MES | Manufacturing Execution System |
| MQTT | Message Queuing Telemetry Transport |
| MTBF | Mean Time Between Failures |
| MTTR | Mean Time To Repair |
| OPC-UA | Open Platform Communications Unified Architecture |
| PDF | Portable Document Format |
| REST | Representational State Transfer |
| RPO | Recovery Point Objective |
| RTO | Recovery Time Objective |
| SLA | Service Level Agreement |
| SRS | Software Requirements Specification |
| TCP | Transmission Control Protocol |
| UI | User Interface |
| UUID | Universally Unique Identifier |
| XML | Extensible Markup Language |

---

## 1.10 References

This document references the following materials.

| Reference | Description |
|------------|-------------|
| BRD-01 | Project Introduction |
| BRD-02 | Business Overview |
| BRD-03 | Business Scope |
| BRD-04 | Business Process |
| BRD-05 | Functional Requirements |
| BRD-06 | Business Rules |
| IEEE 29148 | Systems and Software Engineering – Requirements Engineering |
| BABOK v3 | Business Analysis Body of Knowledge |
| MQTT Specification v5.0 | MQTT Protocol Standard |
| OPC-UA Specification | Industrial Communication Standard |

---

## 1.11 Assumptions

The following assumptions apply:

- All factories follow a similar organizational structure.
- Machines continuously transmit telemetry through supported protocols.
- Gateways buffer telemetry during temporary network failures.
- Historical operational data must remain immutable.
- Local Account authentication is used in the MVP.
- Authorization is managed at the Factory level.
- Production Management is outside the MVP scope.

---

## 1.12 Constraints

The following constraints apply to the MVP:

- Local Account authentication only.
- One Machine belongs to one Production Line at any point in time.
- One Sensor belongs to one Machine at any point in time.
- Historical telemetry cannot be modified.
- Historical assignment records cannot be deleted.
- Raw telemetry data is retained for six months before archival.
- Production execution is not supported.

---

## 1.13 Document Organization

This Software Requirements Specification (SRS) is organized into the following sections.

| Section | Description |
|----------|-------------|
| SRS-01 | Introduction |
| SRS-02 | Overall Description |
| SRS-03 | System Architecture Overview |
| SRS-04 | Functional Requirements |
| SRS-05 | Use Case Specification |
| SRS-06 | Data Requirements |
| SRS-07 | Interface Requirements |
| SRS-08 | Non-functional Requirements |
| SRS-09 | Business Rules Reference |
| SRS-10 | Error Handling |
| SRS-11 | Acceptance Criteria |
| SRS-12 | Requirements Traceability Matrix |

---

# Revision History

| Version | Date | Author | Description |
|----------|------------|------------------|----------------|
| 1.0 | 2026-08-04 | Business Analyst | Initial version |