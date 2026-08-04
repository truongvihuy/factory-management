# SRS-03. System Architecture Overview

**Document Name:** Software Requirements Specification (SRS)  
**Section:** SRS-03 System Architecture Overview  
**Project:** Factory Management System (FMS)  
**Version:** 1.0  
**Status:** Draft

---

# 3. System Architecture Overview

## 3.1 Purpose

This section provides a high-level overview of the Factory Management System (FMS) architecture.

The purpose of this section is to describe the major software components, external systems, communication channels, and overall system interactions. It focuses on **system architecture from a business and logical perspective**, without defining implementation details or technology-specific designs.

Detailed architecture decisions are documented separately in the Software Architecture Document (SAD).

---

# 3.2 Architectural Goals

The Factory Management System shall be designed to achieve the following architectural objectives:

- Support multiple companies and factories.
- Collect telemetry data from thousands of industrial machines.
- Process telemetry data in near real time.
- Detect abnormal operating conditions quickly.
- Support horizontal scalability.
- Ensure high availability.
- Preserve historical operational data.
- Support future business expansion.
- Minimize coupling between system components.

---

# 3.3 High-Level System Context

The Factory Management System interacts with users, industrial equipment, and external services.

```text
+------------------------------------------------------------+
|                         Users                              |
|------------------------------------------------------------|
| Factory Manager | Supervisor | Engineer | Operator | Admin |
+------------------------------+-----------------------------+
                               |
                               |
                        Web / Mobile Browser
                               |
                               |
+------------------------------------------------------------+
|               Factory Management System                    |
+------------------------------------------------------------+
        |             |              |             |
        |             |              |             |
        |             |              |             |
   PostgreSQL     MongoDB       Notification     Audit Log
                                   Services
        |
        |
        |
    IoT Gateway
        |
+-------+-------------------------+
|                                 |
MQTT                         OPC-UA / Modbus TCP
|                                 |
+------------- Industrial Machines ----------------+
```

---

# 3.4 High-Level Components

The Factory Management System consists of the following logical components.

| Component | Responsibility |
|-----------|----------------|
| User Interface | Provides dashboards and management screens |
| Authentication | User login and authentication |
| Authorization | Factory-level access control |
| Organization Management | Manage companies, factories, workshops, and production lines |
| Machine Management | Manage machine lifecycle |
| Sensor Management | Manage sensor lifecycle |
| Telemetry Processing | Receive and process telemetry |
| Alert Engine | Detect abnormal conditions |
| Maintenance Management | Manage maintenance plans and work orders |
| Incident Management | Track operational incidents |
| Reporting | Generate dashboards and reports |
| Notification | Send alerts to users |
| Audit Logging | Record system activities |

---

# 3.5 External Systems

The Factory Management System integrates with several external systems.

| External System | Purpose |
|-----------------|---------|
| MQTT Broker | Receive telemetry messages |
| OPC-UA Server | Connect industrial equipment |
| Modbus TCP Devices | Connect legacy machines |
| Email Server | Send email notifications |
| Push Notification Service | Mobile notifications |
| SMS Gateway | Critical alert notifications |

---

# 3.6 Logical Architecture

The logical architecture consists of four major layers.

```text
Presentation Layer
        │
        ▼
Application Layer
        │
        ▼
Domain Layer
        │
        ▼
Infrastructure Layer
```

### Presentation Layer

Responsible for user interaction.

Includes:

- Dashboard
- Web UI
- REST API
- WebSocket

---

### Application Layer

Responsible for coordinating business use cases.

Examples:

- Create Machine
- Schedule Maintenance
- Generate Alert
- Create Incident

---

### Domain Layer

Responsible for business rules and business logic.

Contains:

- Company
- Factory
- Machine
- Sensor
- Telemetry
- Alert
- Maintenance
- Incident

---

### Infrastructure Layer

Responsible for external integrations.

Examples:

- Database
- MQTT
- OPC-UA
- Email
- File Storage
- Notification

---

# 3.7 Data Flow Overview

Telemetry data flows through the following process.

```text
Machine
    │
Sensor
    │
Gateway
    │
MQTT / OPC-UA / Modbus TCP
    │
Telemetry Processing
    │
Business Rule Evaluation
    │
Alert Engine
    │
Notification
    │
Dashboard
```

Historical telemetry is stored for reporting and future analysis.

---

# 3.8 Functional Component Relationships

The following diagram illustrates the relationships between major business modules.

```text
Organization
      │
      ├──────── Factory
      │
      ├──────── Workshop
      │
      └──────── Production Line
                      │
                      ▼
                  Machine
                      │
                      ▼
                   Sensor
                      │
                      ▼
                  Telemetry
          ┌───────────┼───────────┐
          ▼           ▼           ▼
      Alert      Maintenance   Incident
          │
          ▼
     Notification
```

---

# 3.9 User Interaction Overview

Different user roles interact with different system modules.

| User Role | Main Responsibilities |
|------------|-----------------------|
| Factory Manager | Factory dashboard, KPI monitoring |
| Production Supervisor | Monitor production lines and machine status |
| Maintenance Planner | Schedule maintenance |
| Maintenance Engineer | Execute work orders |
| Operator | Monitor assigned machines and acknowledge alerts |
| Director | Review KPIs and reports |
| System Administrator | Manage users and permissions |

---

# 3.10 Deployment Overview

The MVP is expected to be deployed in a centralized architecture.

```text
Users
   │
Load Balancer
   │
Application Server
   │
────────────────────────────
│                          │
PostgreSQL            MongoDB
│                          │
────────────────────────────
           │
      MQTT Broker
           │
      IoT Gateway
           │
Industrial Equipment
```

Future versions should support horizontal scaling of application servers and telemetry processing components.

---

# 3.11 Data Storage Overview

The system stores different categories of data.

| Data Type | Description |
|-----------|-------------|
| Master Data | Company, Factory, Workshop, Production Line, Machine, Sensor, User |
| Transaction Data | Alerts, Maintenance, Incidents |
| Telemetry Data | Real-time sensor readings |
| Historical Data | Machine history, maintenance history, incident history |
| Audit Data | User actions and configuration changes |
| Archived Data | Expired telemetry retained for long-term analysis |

---

# 3.12 Security Overview

The system shall provide the following security capabilities.

- Local account authentication.
- Factory-level authorization.
- Role-based access control (RBAC).
- Audit logging.
- Secure password storage.
- HTTPS communication.
- Session management.
- Protection against unauthorized access.

---

# 3.13 Availability and Scalability

The architecture shall support the following business objectives.

### Availability

- Management System Availability: **99.9%**
- Critical Monitoring Services: **99.99% (Target)**

### Scalability

Initial deployment:

- Approximately 500 machines.
- 30–50 million telemetry records per day.

Future growth:

- Approximately 5,000 machines.
- Up to 500 million telemetry records per day.

The architecture should support horizontal scaling with minimal impact on business functionality.

---

# 3.14 Architectural Constraints

The following architectural constraints apply to the MVP.

- Local account authentication only.
- Production Management is outside the project scope.
- ERP integration is excluded.
- MES integration is excluded.
- Historical operational data shall remain immutable.
- Authorization shall be enforced at the Factory level.
- One Machine belongs to one Production Line at any point in time.
- One Sensor belongs to one Machine at any point in time.

---

# Revision History

| Version | Date | Author | Description |
|----------|------------|------------------|----------------|
| 1.0 | 2026-08-04 | Business Analyst | Initial version |