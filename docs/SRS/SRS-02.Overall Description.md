# SRS-02. Overall Description

**Document Name:** Software Requirements Specification (SRS)  
**Section:** SRS-02 Overall Description  
**Project:** Factory Management System (FMS)  
**Version:** 1.0  
**Status:** Draft  

---

# 2. Overall Description

## 2.1 Product Perspective

The Factory Management System (FMS) is an enterprise-level industrial monitoring and asset management platform designed to support manufacturing organizations in managing multiple companies, factories, workshops, production lines, machines, sensors, and operational activities.

The system provides a centralized platform for:

- Managing factory organizational structures.
- Monitoring industrial machines.
- Collecting IoT telemetry data.
- Detecting abnormal machine conditions.
- Managing alerts.
- Supporting maintenance activities.
- Managing operational incidents.
- Providing dashboards and reports.

The system acts as a central operational monitoring platform between industrial devices and business users.

High-level system context:

```text
+----------------+
| Industrial     |
| Machines       |
+-------+--------+
        |
        |
+-------v--------+
| Sensors        |
| IoT Devices    |
+-------+--------+
        |
        |
+-------v--------+
| IoT Gateway    |
+-------+--------+
        |
        |
+-------v--------+
| Factory        |
| Management     |
| System (FMS)   |
+-------+--------+
        |
        |
+-------v--------+
| Business Users |
+----------------+
````

---

# 2.2 Product Functions

The Factory Management System provides the following major functions.

---

# 2.2.1 Organization Management

The system shall provide capabilities to manage factory organizational structures.

Functions include:

* Company management.
* Factory management.
* Workshop management.
* Production Line management.

Business hierarchy:

```text
Company
    |
    +-- Factory
            |
            +-- Workshop
                    |
                    +-- Production Line
                            |
                            +-- Machine
                                    |
                                    +-- Sensor
```

---

# 2.2.2 Machine Management

The system shall provide machine lifecycle management.

Functions include:

* Register machines.
* Update machine information.
* Assign machines to production lines.
* Move machines between production lines.
* Track machine assignment history.
* View machine status.
* View machine history.

Machine information includes:

* Machine code.
* Machine name.
* Machine type.
* Model.
* Serial number.
* Manufacturer.
* Installation date.
* Warranty information.
* Operational status.

---

# 2.2.3 Sensor Management

The system shall provide IoT sensor management.

Functions include:

* Register sensors.
* Assign sensors to machines.
* Replace sensors.
* Move sensors.
* Maintain sensor assignment history.

Sensor information includes:

* Sensor code.
* Sensor type.
* Communication protocol.
* Connection status.
* Assigned machine.

---

# 2.2.4 Telemetry Management

The system shall collect and manage machine telemetry data.

Supported protocols:

* MQTT.
* OPC-UA.
* Modbus TCP.

Telemetry data includes:

* Temperature.
* Vibration.
* Pressure.
* Speed.
* Current.
* Voltage.
* Power.
* Energy consumption.
* Machine status.

Functions include:

* Receive telemetry.
* Validate telemetry.
* Store telemetry.
* Display real-time telemetry.
* Query telemetry history.
* Archive historical telemetry.

---

# 2.2.5 Alert Management

The system shall detect abnormal machine conditions.

Functions include:

* Configure alert rules.
* Evaluate telemetry values.
* Generate alerts.
* Assign severity levels.
* Notify responsible users.
* Acknowledge alerts.
* Resolve alerts.
* Maintain alert history.

Alert levels:

* Info.
* Warning.
* Critical.

---

# 2.2.6 Maintenance Management

The system shall support maintenance activities.

Functions include:

* Create maintenance schedules.
* Manage maintenance work orders.
* Assign maintenance engineers.
* Execute maintenance activities.
* Complete maintenance checklists.
* Record maintenance history.

Maintenance types:

* Preventive Maintenance.
* Corrective Maintenance.
* Predictive Maintenance.

---

# 2.2.7 Incident Management

The system shall support operational incident management.

Functions include:

* Create incidents.
* Assign incidents.
* Track incident status.
* Monitor SLA.
* Verify resolution.
* Close incidents.
* Maintain incident history.

Incident lifecycle:

```text
Open
 |
Assigned
 |
In Progress
 |
Resolved
 |
Verified
 |
Closed
```

---

# 2.2.8 User Management

The system shall support user account management.

Functions include:

* Create users.
* Update users.
* Disable users.
* Reset passwords.
* Change passwords.
* Lock and unlock accounts.

---

# 2.2.9 Authorization Management

The system shall provide role-based access control.

Functions include:

* Assign roles.
* Assign factory access.
* Grant permissions.
* Revoke permissions.

Authorization scope:

```text
User
 |
Role
 |
Factory Access
 |
Permission
```

---

# 2.2.10 Dashboard Monitoring

The system shall provide operational dashboards.

Dashboard information includes:

* Machine status.
* Active alerts.
* Maintenance summary.
* Incident summary.
* Operational KPIs.
* Energy consumption.

---

# 2.2.11 Reporting

The system shall provide operational reporting capabilities.

Reports include:

* Machine status reports.
* Maintenance reports.
* Incident reports.
* Energy reports.
* KPI reports.

Export formats:

* PDF.
* Excel.

---

# 2.2.12 Audit Management

The system shall record important system activities.

Audit events include:

* User login.
* User logout.
* Entity creation.
* Entity update.
* Entity deletion.
* Permission changes.
* Configuration changes.

---

# 2.3 User Classes and Characteristics

The system supports different user groups.

| User Role             | Description                                         |
| --------------------- | --------------------------------------------------- |
| System Administrator  | Manage system configuration, users, and permissions |
| Factory Manager       | Monitor factory operations and review reports       |
| Production Supervisor | Monitor workshops and production lines              |
| Maintenance Planner   | Create and manage maintenance schedules             |
| Maintenance Engineer  | Execute maintenance activities                      |
| Operator              | Monitor machines and acknowledge alerts             |
| Director              | Review operational performance and reports          |

---

# 2.4 Operating Environment

The system operates in an industrial manufacturing environment.

## User Environment

Users access the system through:

* Web browsers.
* Desktop computers.
* Mobile devices (future compatibility).

---

## Industrial Environment

The system integrates with:

* Industrial machines.
* IoT sensors.
* IoT gateways.
* Industrial communication protocols.

Supported communication protocols:

* MQTT.
* OPC-UA.
* Modbus TCP.

---

# 2.5 Design and Implementation Constraints

The following constraints apply.

## Business Constraints

* Production Management is outside MVP scope.
* ERP integration is outside MVP scope.
* Historical operational data must remain traceable.

---

## Functional Constraints

* One Machine belongs to one Production Line at a time.
* One Sensor belongs to one Machine at a time.
* Historical assignment records cannot be deleted.
* Telemetry data is immutable.

---

## Authentication Constraints

* MVP uses Local Account authentication.
* External identity providers are not included.

---

# 2.6 Assumptions and Dependencies

## Assumptions

The following assumptions apply:

* Machines continuously generate telemetry data.
* Sensors are correctly installed.
* IoT gateways provide connectivity between devices and the system.
* Users receive appropriate permissions before accessing data.
* Factory structures are maintained accurately.

---

## Dependencies

The system depends on:

| Dependency                | Purpose                         |
| ------------------------- | ------------------------------- |
| IoT Gateway               | Collect telemetry from machines |
| MQTT Broker               | Message communication           |
| OPC-UA Server             | Industrial data communication   |
| Modbus TCP Device         | Machine communication           |
| Email Service             | Alert notification              |
| Push Notification Service | User notification               |
| SMS Provider              | Critical alert notification     |

---

# 2.7 General System Characteristics

The system shall provide:

## Reliability

* Maintain historical operational data.
* Prevent unauthorized data modification.
* Ensure consistent asset relationships.

---

## Scalability

The system shall support:

* Multiple companies.
* Multiple factories.
* Multiple workshops.
* Multiple production lines.
* Multiple machines.
* Multiple sensors.

---

## Availability

The system shall support continuous monitoring operations.

---

## Security

The system shall provide:

* Authentication.
* Authorization.
* Access control.
* Audit tracking.

---

## Maintainability

The system shall support:

* Clear module separation.
* Requirement traceability.
* Operational monitoring.
* System maintenance.

---

# 2.8 System Boundaries

The Factory Management System is responsible for:

```text
+--------------------------------+
| Factory Management System      |
|                                |
| - Organization Management      |
| - Machine Management           |
| - Sensor Management            |
| - Telemetry Management         |
| - Alert Management             |
| - Maintenance Management       |
| - Incident Management          |
| - User Management              |
| - Authorization                |
| - Dashboard                    |
| - Reporting                    |
| - Audit Log                    |
+--------------------------------+
```

External systems are responsible for:

```text
+----------------+
| IoT Devices    |
+----------------+

+----------------+
| IoT Gateway    |
+----------------+

+----------------+
| Notification   |
| Services       |
+----------------+
```

---

# 2.9 Summary

The Factory Management System provides a centralized platform for industrial asset monitoring and operational management.

The system enables organizations to:

* Improve machine visibility.
* Detect abnormal conditions.
* Reduce downtime.
* Standardize maintenance activities.
* Improve incident response.
* Analyze operational performance.

This SRS section establishes the overall product understanding before defining detailed architecture, functional requirements, interfaces, and technical specifications in subsequent sections.

---

# Revision History

| Version | Date       | Author           | Description     |
| ------- | ---------- | ---------------- | --------------- |
| 1.0     | 2026-08-07 | Business Analyst | Initial version |
