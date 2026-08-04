# BRD-01. Introduction

Document Name: Business Requirements Document (BRD)

Project Name: Factory Management System (FMS)

Version: 1.0

Status: Draft

Author: Business Analyst

Last Updated: 2026-08-04

# 1. Introduction
## 1.1 Purpose

This Business Requirements Document (BRD) defines the business requirements for the Factory Management System (FMS).

The purpose of this document is to:

- Define the business problems that the system is expected to solve.
- Establish a common understanding of the project scope between the Product Owner and the development team.
- Provide the foundation for the Software Requirements Specification (SRS), system design, and implementation.
- Minimize misunderstandings and requirement changes during development.

This document does not describe technical solutions, system architecture, database design, or implementation details.

## 1.2 Background

Modern manufacturing plants operate a large number of machines, sensors, and Industrial IoT (IIoT) devices. Managing these assets using spreadsheets or isolated systems introduces several operational challenges:

- Limited visibility into machine status in real time.
- Delayed detection of equipment failures.
- Lack of centralized operational data for analysis.
- Maintenance activities are largely reactive or experience-driven.
- Data is scattered across multiple factories.
- Reporting requires significant manual effort.

To address these challenges, the company requires a centralized Factory Management System capable of monitoring assets, collecting telemetry data, managing maintenance activities, handling incidents, and providing operational insights.

## 1.3 Business Problems

The organization currently faces the following business challenges.

### Asset Management
- Difficulty managing a large number of machines and equipment.
- No centralized history of machine location changes.
- Limited traceability of sensor assignments.

### Operational Monitoring
- Inability to monitor machine status in real time.
- Delayed detection of abnormal operating conditions.
- IoT data is collected from different protocols without centralized management.

### Maintenance Management
- Maintenance schedules are managed manually.
- No standardized maintenance checklist.
- Difficult to track maintenance history.
- Unable to evaluate maintenance effectiveness.

### Incident Management
- No standardized incident management workflow.
- Difficult to monitor SLA compliance.
- No escalation mechanism for critical incidents.

### Reporting
- Operational data is fragmented.
- Reports require manual consolidation.
- No real-time operational dashboard.

## 1.4 Business Objectives

The Factory Management System aims to achieve the following business objectives.

### Primary Objectives
- Reduce machine downtime.
- Detect equipment abnormalities as early as possible.
- Improve operational visibility.
- Standardize maintenance processes.
- Standardize incident management processes.
- Centralize operational data across multiple factories.

### Long-Term Objectives
- Establish the foundation for a Smart Factory platform.
- Enable data-driven decision making.
- Reduce operational costs.
- Reduce maintenance costs.
- Improve system scalability.
- Support future integration with enterprise systems.

## 1.5 Project Scope

The MVP focuses on Factory Monitoring and Asset Management.

The system includes:

- Company Management
- Factory Management
- Workshop Management
- Production Line Management
- Machine Management
- Sensor Management
- IoT Telemetry Collection
- Real-time Monitoring
- Alert Management
- Maintenance Management
- Incident Management
- User Management
- Factory-based Authorization
- Dashboard
- Reporting

## 1.6 Out of Scope

The following business domains are excluded from the MVP.

### Production Management
- Production Order Management
- Product Management
- Production Planning
- Production Scheduling

### Quality Management
- Quality Inspection
- Quality Control
- Reject Analysis

### Warehouse Management
- Inventory Management
- Material Management
- Bill of Materials (BOM)


### ERP Integration

Integration with ERP systems is not included in the MVP.

### Manufacturing Execution System (MES)

MES functionality is outside the current project scope.

### Financial Management
- Cost Accounting
- Purchasing
- Financial Reporting

These capabilities may be considered in future project phases.

## 1.7 Success Criteria

The project will be considered successful when the following objectives are achieved.

### Business
- Support multiple companies.
- Support multiple factories.
- Support multiple workshops.
- Support multiple production lines.
- Support multiple machines.
- Support multiple sensors.

### Monitoring
- Display real-time machine status.
- Continuously collect IoT telemetry.
- Generate alerts based on configured business rules.
- Provide near real-time dashboards.

### Maintenance
- Manage maintenance schedules.
- Manage maintenance work orders.
- Support maintenance checklists.
- Maintain complete maintenance history.

### Incident Management
- Manage incident lifecycle.
- Track SLA compliance.
- Maintain incident history.

### Reporting
- Provide operational dashboards.
- Generate KPI reports.
- Export reports to PDF.
- Export reports to Excel.


## 1.8 Assumptions

The following assumptions apply to the project.

- One Company can own multiple Factories.
- One Factory can contain multiple Workshops.
- One Workshop can contain multiple Production Lines.
- One Production Line can contain multiple Machines.
- A Machine belongs to only one Production Line at any point in time.
- A Sensor belongs to only one Machine at any point in time.
- When a Machine is reassigned to another Production Line, its assignment history must be preserved.
- When a Sensor is reassigned to another Machine, the assignment history must be preserved.
- Historical telemetry data must always remain associated with the original Machine where it was collected.
- Telemetry data is append-only and cannot be modified after ingestion.
- Users authenticate using local accounts.
- A user may have access to multiple Factories.
- Authorization is managed at the Factory level.
- Raw telemetry data will be archived after the configured retention period rather than immediately deleted.
## 1.9 Constraints

The project is subject to the following constraints.

- The system must support MQTT, OPC-UA, and Modbus TCP communication protocols.
- Dashboards must provide near real-time monitoring.
- Alert notifications must be generated within the defined response time.
- Raw telemetry data shall be archived after the configured retention period.
- The system must support future scaling to multiple factories and thousands of machines.
- Production management functionality is excluded from the MVP.


## 1.10 Intended Audience

This document is intended for the following stakeholders.

| Role | Responsibility |
|------|----------------|
| Product Owner | Validate business requirements |
| Business Analyst | Analyze and document requirements |
| Solution Architect | Design the overall solution architecture |
| Technical Lead | Define technical implementation strategy |
| Backend Developer | Implement backend services |
| Frontend Developer | Develop user interfaces |
| QA Engineer | Prepare test scenarios and validate functionality |
| Project Manager | Manage project scope and delivery |