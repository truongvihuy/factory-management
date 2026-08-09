# BRD-02. Business Overview

Document Name: Business Requirements Document (BRD)

Section: BRD-02 Business Overview

Project: Factory Management System (FMS)

# 2. Business Overview

## 2.1 Business Overview

The Factory Management System (FMS) is an enterprise platform designed to centralize the management and monitoring of industrial assets across multiple companies and factories.

The system enables organizations to manage factory structures, monitor machine health in real time, receive abnormal condition alerts, manage maintenance activities, handle incidents, and analyze operational performance through dashboards and reports.

The primary objective of the system is to improve equipment reliability, reduce machine downtime, standardize maintenance processes, and provide a single source of operational data for factory management.

The MVP focuses on Factory Monitoring, Asset Management, Maintenance Management, and Incident Management. Production execution and manufacturing process management are intentionally excluded from the current project scope.

## 2.2 Business Vision

The organization aims to build a centralized Smart Factory platform that provides real-time visibility into factory operations while supporting future business growth.

The long-term vision includes:

- Centralized monitoring across multiple companies and factories.
- Real-time visibility into industrial assets.
- Data-driven maintenance strategy.
- Early detection of abnormal machine conditions.
- Standardized operational processes.
- Scalable architecture capable of supporting future integrations with enterprise systems.

## 2.3 Business Goals

The system is expected to achieve the following business goals.

| Priority | Goal                                                      |
| -------- | --------------------------------------------------------- |
| High     | Reduce machine downtime                                   |
| High     | Detect abnormal machine conditions as early as possible   |
| High     | Improve asset availability                                |
| High     | Standardize maintenance processes                         |
| Medium   | Reduce maintenance costs                                  |
| Medium   | Improve equipment utilization                             |
| Medium   | Reduce energy consumption                                 |
| Medium   | Improve operational visibility                            |
| Low      | Provide historical operational data for business analysis |

## 2.4 Business Scope

The Factory Management System manages the following business domains.

```
Company
    │
    ├── Factory
    │
    ├── Workshop
    │
    ├── Production Line
    │
    ├── Machine
    │
    ├── Sensor
    │
    ├── Telemetry
    │
    ├── Alert
    │
    ├── Maintenance
    │
    ├── Incident
    │
    ├── User
    │
    └── Reporting
```

## 2.5 Organizational Structure

The business hierarchy is defined as follows.

```
Company
    │
    ├── Factory
    │       │
    │       ├── Workshop
    │       │      │
    │       │      ├── Production Line
    │       │              │
    │       │              ├── Machine
    │       │                      │
    │       │                      ├── Sensor
```

### Company

Represents an organization that owns one or more factories.

### Factory

Represents a manufacturing facility.

A factory contains:

- Workshops
- Production Lines
- Machines

### Workshop

Represents a physical production area inside a factory.

Each workshop contains one or more production lines.

### Production Line

Represents a group of machines working together.

### Business Rule:

A Machine belongs to only one Production Line at any point in time.

### Machine

Represents a physical industrial asset.

Each machine contains:

- Machine Information
- Machine Status
- Sensor Assignment
- Maintenance History
- Incident History
- Telemetry History

### Sensor

Represents an IoT device attached to a machine.

A Sensor belongs to only one Machine at any point in time.

When a Sensor is moved:

- Assignment history must be preserved.
- Historical telemetry remains associated with the original Machine.

## 2.6 Business Actors

The following stakeholders interact with the system.

| Role                  | Responsibilities                                  |
| --------------------- | ------------------------------------------------- |
| Factory Manager       | Monitor overall factory operations                |
| Production Supervisor | Monitor workshops and production lines            |
| Maintenance Planner   | Schedule maintenance activities                   |
| Maintenance Engineer  | Execute maintenance work orders                   |
| Operator              | Monitor assigned machines and acknowledge alerts  |
| Director              | Review KPIs and management reports                |
| System Administrator  | Configure users, permissions, and system settings |

## 2.7 Business Capabilities

The system provides the following business capabilities.

### Asset Management

- Company Management
- Factory Management
- Workshop Management
- Production Line Management
- Machine Management
- Sensor Management
- Monitoring
- Real-time telemetry collection
- Machine status monitoring
- Machine health monitoring
- Historical telemetry tracking
- Alert Management

### Threshold monitoring

- Alert generation
- Alert acknowledgment
- Alert escalation
- Alert history

### Maintenance Management

- Maintenance scheduling
- Preventive maintenance
- Corrective maintenance
- Predictive maintenance
- Maintenance work orders
- Maintenance checklist
- Spare part tracking
- Maintenance history

### Incident Management

- Incident creation
- Incident assignment
- SLA tracking
- Incident lifecycle management
- Major Incident grouping

### Reporting

- Operational Dashboard
- Machine Status Report
- Maintenance Report
- Incident Report
- Energy Consumption Report
- KPI Dashboard
- Export to PDF
- Export to Excel

## 2.8 Business Processes

The MVP supports the following core business processes.

### Asset Lifecycle

```
Create Machine
        │
Install Machine
        │
Assign Production Line
        │
Assign Sensor
        │
Start Monitoring
        │
Maintenance
        │
Retirement
```

### Monitoring Process

```
Sensor

↓

Gateway

↓

Telemetry

↓

Monitoring

↓

Dashboard
```

### Alert Process

```
Telemetry

↓

Business Rule Evaluation

↓

Alert

↓

Notification

↓

Acknowledgment

↓

Resolution

↓

Close
```

### Maintenance Process

```
Maintenance Schedule

↓

Approval

↓

Work Order

↓

Maintenance Checklist

↓

Complete

↓

Maintenance History
```

### Incident Process

```
Incident

↓

Assignment

↓

Investigation

↓

Resolution

↓

Verification

↓

Closure
```

## 2.9 Business Policies

The following business policies govern system operations.

### Asset Policy

- Every Machine must belong to one Production Line.
- Every Sensor must belong to one Machine.
- Assignment history must never be deleted.

### Monitoring Policy

- Telemetry data is append-only.
- Historical telemetry cannot be modified.
- Real-time monitoring must always reflect the latest machine status.

### Maintenance Policy

- Maintenance activities require an approved Work Order.
- Every completed maintenance activity must include a checklist.
- Maintenance history must be permanently retained.

### Incident Policy

- Every Incident is associated with one Machine.
- Critical Incidents must comply with SLA requirements.
- Every Incident must follow the defined lifecycle.

### Security Policy

- Users authenticate using Local Accounts.
- A user may access multiple Factories.
- Authorization is enforced at the Factory level.

### Data Retention Policy

- Raw telemetry data is retained for six months.
- After the retention period, raw telemetry data is archived.
- Summary data is retained for five years.

## 2.10 Business Assumptions

The following assumptions apply throughout the project.

- All factories follow a similar operational model.
- IoT devices support MQTT, OPC-UA, or Modbus TCP.
- Every machine periodically sends telemetry data.
- Machine assignment changes are infrequent.
- Sensor replacement is infrequent.
- Historical operational data must remain traceable.
- Production management is outside the MVP scope.

## 2.11 Future Business Expansion

The system should support future expansion without significant business process changes.

Potential future modules include:

- Manufacturing Execution System (MES)
- Production Management
- Production Orders
- Product Management
- Quality Management
- ERP Integration
- Warehouse Management
- Inventory Management
- AI-based Predictive Analytics
- Digital Twin
- Multi-site Operational Analytics

# Senior BA Review

BRD-02 establishes the business context and operating model of the Factory Management System. It defines:

- The organizational hierarchy and business entities.
- The stakeholders and their responsibilities.
- The core business capabilities and workflows.
- The governing business policies.
- The long-term business vision and expansion roadmap.

This section serves as the bridge between the high-level project introduction (BRD-01) and the detailed business scope and functional requirements that will be documented in the subsequent sections.
