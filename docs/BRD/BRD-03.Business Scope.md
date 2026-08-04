# BRD-03. Business Scope

**Document Name:** Business Requirements Document (BRD)  
**Section:** BRD-03 Business Scope  
**Project:** Factory Management System (FMS)

---

# 3. Business Scope

## 3.1 Scope Statement

The Factory Management System (FMS) is designed to provide a centralized platform for monitoring and managing industrial assets across multiple companies and factories.

The MVP focuses on **Factory Monitoring**, **Asset Management**, **Maintenance Management**, and **Incident Management**. The system enables organizations to monitor machine health, collect telemetry data, manage maintenance activities, handle incidents, and provide operational dashboards and reports.

Business domains related to manufacturing execution, production planning, inventory, and ERP are intentionally excluded from the MVP to keep the project focused and manageable.

---

# 3.2 In Scope

The following business capabilities are included in the MVP.

## 3.2.1 Organization Management

The system shall support:

- Company Management
- Factory Management
- Workshop Management
- Production Line Management

### Business Objectives

- Manage multiple companies.
- Manage multiple factories under a company.
- Organize workshops within factories.
- Organize production lines within workshops.

---

## 3.2.2 Machine Management

The system shall support:

- Register machines.
- Update machine information.
- View machine details.
- Activate or deactivate machines.
- Track machine lifecycle.
- Maintain machine assignment history.

### Machine Information

- Machine Code
- Machine Name
- Machine Type
- Model
- Serial Number
- Manufacturer
- Factory
- Workshop
- Production Line
- Installation Date
- Warranty Expiry
- Running Hours
- Status
- Last Maintenance
- Next Maintenance

### Business Rules

- A Machine belongs to only one Production Line at any point in time.
- Machine assignment history must always be preserved.

---

## 3.2.3 Sensor Management

The system shall support:

- Register sensors.
- Assign sensors to machines.
- Replace sensors.
- Move sensors between machines.
- Track sensor assignment history.

### Business Rules

- A Sensor belongs to only one Machine at any point in time.
- Historical telemetry must remain associated with the original Machine.
- Sensor assignment history shall never be deleted.

---

## 3.2.4 Telemetry Monitoring

The system shall support:

- Collect telemetry data.
- Store telemetry history.
- Display real-time telemetry.
- Monitor machine status.
- Display machine health.

### Supported Protocols

- MQTT
- OPC-UA
- Modbus TCP

### Typical Telemetry Data

- Temperature
- Vibration
- Pressure
- Humidity
- Speed
- Current
- Voltage
- Power
- Energy Consumption
- Machine Status

---

## 3.2.5 Alert Management

The system shall support:

- Configure alert thresholds.
- Detect abnormal conditions.
- Generate alerts.
- Notify responsible users.
- Acknowledge alerts.
- Resolve alerts.
- Maintain alert history.

### Alert Levels

- Info
- Warning
- Critical

### Notification Channels

- Dashboard
- Email
- Mobile Push Notification
- SMS (Critical only)

---

## 3.2.6 Maintenance Management

The system shall support:

- Preventive Maintenance
- Corrective Maintenance
- Predictive Maintenance
- Maintenance Scheduling
- Maintenance Approval
- Maintenance Work Orders
- Maintenance Checklists
- Spare Part Tracking
- Maintenance History

### Checklist

Each completed maintenance work order shall contain:

- Inspection Items
- Technician
- Completion Result
- Notes
- Attachments (optional)

---

## 3.2.7 Incident Management

The system shall support:

- Create Incident
- Assign Incident
- Track SLA
- Update Incident Status
- Verify Resolution
- Close Incident
- Maintain Incident History

### Incident Workflow

- Open
- Assigned
- In Progress
- Resolved
- Verified
- Closed

---

## 3.2.8 User Management

The system shall support:

- Create User
- Update User
- Disable User
- Reset Password
- Change Password

### Authentication

The MVP uses Local Accounts.

Future integration with LDAP or SSO is outside the current scope.

---

## 3.2.9 Authorization

Authorization is managed at the Factory level.

The system shall support:

- Assign users to multiple factories.
- Restrict data access by factory.
- Assign roles.

Typical roles include:

- Factory Manager
- Production Supervisor
- Maintenance Planner
- Maintenance Engineer
- Operator
- Director
- System Administrator

---

## 3.2.10 Reporting

The system shall provide:

### Dashboard

- Machine Status
- Active Alerts
- Maintenance Summary
- Incident Summary
- Energy Consumption

### Reports

- Machine Status Report
- Maintenance Report
- Incident Report
- Energy Report
- KPI Dashboard

### Export

- PDF
- Excel

---

## 3.2.11 Audit Log

The system shall record:

- User Login
- User Logout
- CRUD Operations
- Configuration Changes
- Permission Changes
- Alert Configuration Changes

---

# 3.3 Out of Scope

The following business capabilities are excluded from the MVP.

## Production Management

- Production Orders
- Product Management
- Production Planning
- Production Scheduling
- Production Execution

---

## Manufacturing Execution System (MES)

- Work Instructions
- Manufacturing Workflow
- Operator Instructions
- Process Tracking

---

## Quality Management

- Quality Inspection
- Quality Control
- SPC
- Reject Analysis

---

## Warehouse Management

- Inventory
- Material Tracking
- Warehouse Operations
- Bill of Materials (BOM)

---

## ERP Integration

- SAP
- Oracle ERP
- Microsoft Dynamics
- Other ERP Platforms

---

## Financial Management

- Purchasing
- Accounting
- Cost Management
- Financial Reporting

---

# 3.4 Future Scope

The following capabilities may be implemented in future phases.

- ERP Integration
- MES Integration
- Production Order Management
- Product Management
- Inventory Management
- AI Predictive Analytics
- Machine Learning
- Digital Twin
- Energy Optimization
- Mobile Maintenance Application
- Multi-site Analytics

---

# 3.5 Scope Boundaries

The MVP focuses on operational monitoring and maintenance.

The system is responsible for:

- Monitoring machine status.
- Managing industrial assets.
- Collecting telemetry data.
- Managing maintenance.
- Managing incidents.
- Providing operational dashboards.

The system is **not responsible** for:

- Production execution.
- Production scheduling.
- Manufacturing planning.
- Inventory management.
- Financial operations.
- Enterprise resource planning.

---

# 3.6 Success Criteria

The MVP is considered complete when it can:

- Support multiple companies.
- Support multiple factories.
- Support multiple workshops.
- Support multiple production lines.
- Manage machine lifecycle.
- Manage sensor lifecycle.
- Collect telemetry in real time.
- Detect abnormal machine conditions.
- Generate alerts.
- Manage maintenance activities.
- Manage incidents.
- Support factory-level authorization.
- Provide operational dashboards.
- Export reports.

---

# 3.7 Scope Assumptions

The following assumptions apply.

- Each Company owns one or more Factories.
- Each Factory contains one or more Workshops.
- Each Workshop contains one or more Production Lines.
- Each Machine belongs to one Production Line at a time.
- Each Sensor belongs to one Machine at a time.
- Historical data shall never be modified.
- Raw telemetry data will be archived after the configured retention period.
- Production management is outside the MVP scope.

---

# 3.8 Dependencies

The project depends on:

- IoT Gateway
- MQTT Broker
- OPC-UA Servers
- Modbus TCP Devices
- Email Service
- Push Notification Service
- SMS Provider (Critical Alerts)
- Authentication Service (Local Account)

---

# 3.9 Risks

Potential business risks include:

- Unstable network connectivity between gateways and the platform.
- Large telemetry volume affecting system performance.
- Incorrect alert threshold configuration.
- Delayed maintenance response.
- Incomplete or inaccurate machine information.
- Low user adoption due to insufficient training.

---