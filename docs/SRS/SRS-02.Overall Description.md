# SRS-02. Overall Description

**Document Name:** Software Requirements Specification (SRS)  
**Section:** SRS-02 Overall Description  
**Project:** Factory Management System (FMS)  
**Version:** 1.0  
**Status:** Draft

---

# 2. Overall Description

## 2.1 Product Perspective

The Factory Management System (FMS) is an enterprise software platform designed to centralize the monitoring and management of industrial assets across multiple companies and factories.

The system collects telemetry from industrial machines through IoT gateways, continuously monitors equipment health, generates alerts for abnormal conditions, manages maintenance and incidents, and provides operational dashboards and analytical reports.

The MVP focuses on operational monitoring and maintenance management. Manufacturing execution, production planning, inventory management, and ERP integration are intentionally excluded and may be implemented in future releases.

---

## 2.2 Product Goals

The Factory Management System aims to achieve the following business objectives:

- Reduce machine downtime.
- Detect abnormal machine conditions as early as possible.
- Improve equipment availability.
- Improve maintenance efficiency.
- Reduce maintenance costs.
- Improve operational visibility.
- Reduce energy consumption.
- Provide reliable historical operational data.
- Support future business expansion.

---

## 2.3 Product Functions

The system provides the following high-level functional capabilities.

### Organization Management

- Company Management
- Factory Management
- Workshop Management
- Production Line Management

---

### Asset Management

- Machine Registration
- Machine Assignment
- Machine Relocation
- Sensor Registration
- Sensor Assignment
- Sensor Relocation

---

### Monitoring

- Telemetry Collection
- Real-time Monitoring
- Historical Telemetry
- Machine Status Monitoring

---

### Alert Management

- Threshold Configuration
- Alert Detection
- Alert Notification
- Alert Escalation
- Alert Acknowledgement

---

### Maintenance Management

- Maintenance Scheduling
- Work Orders
- Maintenance Checklist
- Spare Part Tracking
- Maintenance History

---

### Incident Management

- Incident Registration
- Incident Assignment
- SLA Tracking
- Major Incident Management

---

### User Management

- User Accounts
- Authentication
- Authorization
- Factory-Level Permission

---

### Reporting

- Operational Dashboard
- KPI Dashboard
- Machine Reports
- Maintenance Reports
- Incident Reports
- Energy Reports
- PDF Export
- Excel Export

---

## 2.4 User Classes

The following user roles interact with the system.

| User Role | Responsibilities |
|------------|------------------|
| Factory Manager | Monitor overall factory operations |
| Production Supervisor | Monitor workshops and production lines |
| Maintenance Planner | Create maintenance schedules |
| Maintenance Engineer | Execute maintenance work orders |
| Operator | Monitor assigned machines and acknowledge alerts |
| Director | Review KPIs and management reports |
| System Administrator | Manage users, permissions, and system configuration |

---

## 2.5 Operating Environment

The system is expected to operate in the following environment.

### Client

- Modern Web Browser
- Desktop Computer
- Tablet
- Mobile Browser (Responsive)

### Server

- Linux Operating System
- Containerized Deployment
- Docker
- Kubernetes (Future)

### Database

- PostgreSQL
- MongoDB (Telemetry Storage)

### Communication

- REST API
- WebSocket
- MQTT
- OPC-UA
- Modbus TCP

---

## 2.6 System Context

The Factory Management System communicates with several external systems.

```text
+----------------------+
|     Users            |
+----------+-----------+
           |
           |
      Web Browser
           |
           |
+----------v-----------+
| Factory Management   |
|      System          |
+----------+-----------+
           |
    +------+------+--------------------+
    |             |                    |
    |             |                    |
 REST API     WebSocket             MQTT
    |             |                    |
    |             |                    |
 PostgreSQL   Dashboard         IoT Gateway
                                     |
                          +----------+----------+
                          |                     |
                      OPC-UA              Modbus TCP
                          |                     |
                      Industrial Machines & Sensors
```

---

## 2.7 User Characteristics

### Factory Manager

- Operational management experience.
- Requires dashboards and KPIs.
- Limited technical knowledge.

---

### Production Supervisor

- Monitors machine operations.
- Reviews alerts.
- Coordinates maintenance activities.

---

### Maintenance Planner

- Creates maintenance schedules.
- Plans preventive maintenance.
- Reviews maintenance history.

---

### Maintenance Engineer

- Performs maintenance activities.
- Completes work orders.
- Updates maintenance checklists.

---

### Operator

- Monitors assigned machines.
- Acknowledges alerts.
- Reports machine abnormalities.

---

### Director

- Reviews business KPIs.
- Makes strategic decisions.
- Requires summarized reports.

---

### System Administrator

- Configures users.
- Manages permissions.
- Maintains system configuration.

---

## 2.8 Assumptions

The following assumptions apply.

- All factories use a similar organizational structure.
- Each Company owns one or more Factories.
- Each Factory contains one or more Workshops.
- Each Workshop contains one or more Production Lines.
- Each Machine belongs to one Production Line at a time.
- Each Sensor belongs to one Machine at a time.
- IoT Gateways buffer telemetry during temporary network failures.
- Historical operational data is immutable.
- Local Account authentication is used for the MVP.

---

## 2.9 Constraints

The following constraints apply.

### Business Constraints

- Production Management is outside the MVP scope.
- Manufacturing Execution (MES) is excluded.
- Inventory Management is excluded.
- ERP integration is excluded.

### Technical Constraints

- Local Account authentication only.
- Authorization is enforced at the Factory level.
- Historical telemetry cannot be modified.
- Historical assignment records cannot be deleted.

---

## 2.10 Dependencies

The system depends on the following external components.

### IoT Infrastructure

- MQTT Broker
- OPC-UA Server
- Modbus TCP Devices
- IoT Gateway

---

### Communication Services

- SMTP Email Server
- Push Notification Service
- SMS Provider (Critical Alerts)

---

### Database Services

- PostgreSQL
- MongoDB

---

## 2.11 Data Characteristics

The system manages two major categories of data.

### Master Data

- Company
- Factory
- Workshop
- Production Line
- Machine
- Sensor
- User
- Role

---

### Transactional Data

- Telemetry
- Alerts
- Maintenance Records
- Incident Records
- Audit Logs

---

### Historical Data

Historical records include:

- Telemetry History
- Machine Assignment History
- Sensor Assignment History
- Maintenance History
- Incident History
- Alert History

Historical records shall be immutable.

---

## 2.12 Data Retention

| Data Type | Retention |
|------------|-----------|
| Raw Telemetry | 6 Months |
| Summary Data | 5 Years |
| Audit Logs | Configurable |
| Maintenance History | Permanent |
| Incident History | Permanent |

Archived telemetry data shall remain searchable.

---

## 2.13 Scalability Expectations

The system should support future business growth.

### Initial Deployment

- 3 Companies
- 10 Factories
- Approximately 500 Machines
- 30–50 Million Telemetry Records per Day

### Future Growth

- Multiple Companies
- Additional Factories
- Approximately 5,000 Machines
- Up to 500 Million Telemetry Records per Day

The software architecture should support horizontal scaling with minimal impact on existing functionality.

---

## 2.14 Future Expansion

Future versions of the system may include:

- Manufacturing Execution System (MES)
- Production Order Management
- Product Management
- Warehouse Management
- Inventory Management
- ERP Integration
- AI-Based Predictive Analytics
- Digital Twin
- Mobile Maintenance Application
- Multi-site Analytics

---

## 2.15 General System Characteristics

The Factory Management System is expected to be:

- Modular
- Scalable
- Highly Available
- Secure
- Maintainable
- Extensible
- Fault Tolerant
- Event-Driven
- Cloud Ready
- Suitable for Enterprise Deployment

---

# Revision History

| Version | Date | Author | Description |
|----------|------------|------------------|----------------|
| 1.0 | 2026-08-04 | Business Analyst | Initial version |