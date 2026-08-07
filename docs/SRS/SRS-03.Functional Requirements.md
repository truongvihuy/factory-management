# SRS-04. Non-Functional Requirements

**Document Name:** Software Requirements Specification (SRS)  
**Section:** SRS-04 Non-Functional Requirements  
**Project:** Factory Management System (FMS)  
**Version:** 1.0  
**Status:** Draft  

---

# 4. Non-Functional Requirements

## 4.1 Overview

This document defines the non-functional requirements (NFR) for the **Factory Management System (FMS)**.

Non-functional requirements define the quality attributes, operational constraints, and expected system behaviors related to:

- Performance.
- Scalability.
- Availability.
- Security.
- Reliability.
- Maintainability.
- Usability.
- Monitoring.
- Data management.

These requirements define how the system shall operate rather than what functions the system provides.

---

# 4.2 Performance Requirements

## NFR-PER-01 Response Time

The system shall provide acceptable response times for normal user operations.

Target response time:

| Operation | Expected Response Time |
| --------- | ---------------------- |
| User login | ≤ 2 seconds |
| Query master data | ≤ 2 seconds |
| View machine detail | ≤ 3 seconds |
| Load dashboard | ≤ 5 seconds |
| Generate standard report | ≤ 10 seconds |

---

## NFR-PER-02 Real-Time Monitoring

The system shall support near real-time machine monitoring.

Requirements:

- Machine status updates shall be reflected on dashboards within acceptable latency.
- Telemetry processing delay shall be minimized.
- Alert evaluation shall occur immediately after telemetry ingestion.

Target:

- Telemetry processing latency: ≤ 5 seconds under normal conditions.

---

## NFR-PER-03 Telemetry Processing

The system shall support continuous telemetry ingestion.

The system shall:

- Receive telemetry from multiple machines simultaneously.
- Process high-frequency telemetry streams.
- Prevent telemetry loss during normal operation.

---

# 4.3 Scalability Requirements

## NFR-SCA-01 Multi-Company Support

The system shall support multiple companies within the same platform.

---

## NFR-SCA-02 Multi-Factory Support

The system shall support:

- Multiple factories per company.
- Multiple workshops per factory.
- Multiple production lines per workshop.
- Multiple machines per production line.

---

## NFR-SCA-03 Machine Scalability

The system shall support future expansion of:

- Number of machines.
- Number of sensors.
- Number of telemetry sources.

The system design shall not limit business growth.

---

## NFR-SCA-04 Horizontal Expansion

The system should support future horizontal scaling when operational workload increases.

Examples:

- Increase monitoring capacity.
- Support additional factories.
- Support additional telemetry sources.

---

# 4.4 Availability Requirements

## NFR-AVA-01 System Availability

The system shall provide high availability for factory monitoring operations.

Target:

- Minimum availability: 99.5%

---

## NFR-AVA-02 Continuous Monitoring

The system shall support continuous monitoring during factory operation hours.

The system shall minimize:

- Service interruption.
- Data loss.
- Monitoring downtime.

---

## NFR-AVA-03 Failure Recovery

The system shall recover from failures.

The system shall support:

- Service restart.
- Data recovery.
- Error recovery procedures.

---

# 4.5 Reliability Requirements

## NFR-REL-01 Data Integrity

The system shall ensure operational data integrity.

Requirements:

- Historical telemetry cannot be modified.
- Historical assignment records cannot be deleted.
- Audit records must remain consistent.

---

## NFR-REL-02 Telemetry Reliability

The system shall ensure telemetry reliability.

Requirements:

- Validate incoming telemetry.
- Handle invalid telemetry data.
- Prevent duplicate processing when applicable.

---

## NFR-REL-03 Transaction Reliability

The system shall maintain data consistency during business operations.

Examples:

- Machine assignment changes.
- Sensor replacement.
- Maintenance completion.
- Incident closure.

---

# 4.6 Security Requirements

## NFR-SEC-01 Authentication

The system shall authenticate users before granting access.

MVP requirement:

- Local Account authentication.

---

## NFR-SEC-02 Authorization

The system shall enforce access control.

Requirements:

- Role-based authorization.
- Factory-level data access restriction.
- Permission validation.

---

## NFR-SEC-03 Password Security

The system shall protect user credentials.

Requirements:

- Passwords shall not be stored as plain text.
- Password reset shall require authorization.
- User sessions shall be protected.

---

## NFR-SEC-04 Audit Security

The system shall record security-related activities.

Examples:

- Login.
- Logout.
- Permission changes.
- User changes.

---

## NFR-SEC-05 Data Protection

The system shall protect sensitive operational data.

Requirements:

- Prevent unauthorized access.
- Validate user permissions before data retrieval.
- Protect communication channels.

---

# 4.7 Maintainability Requirements

## NFR-MAI-01 Modular Design

The system shall be designed with clear functional separation.

Modules include:

- Organization Management.
- Factory Management.
- Workshop Management.
- Production Line Management.
- Machine Management.
- Sensor Management.
- Telemetry Management.
- Alert Management.
- Maintenance Management.
- Incident Management.
- User Management.
- Authorization.
- Dashboard.
- Reporting.
- Audit.

---

## NFR-MAI-02 Code Maintainability

The system should support:

- Clear coding standards.
- Consistent naming conventions.
- Documentation.
- Automated testing.

---

## NFR-MAI-03 Requirement Traceability

Each functional requirement shall be traceable to:

- Business requirement.
- Use case.
- Test case.

---

# 4.8 Usability Requirements

## NFR-USA-01 User Interface

The system interface shall provide:

- Clear navigation.
- Consistent user experience.
- Understandable information display.

---

## NFR-USA-02 Dashboard Usability

Dashboard screens shall provide:

- Machine overview.
- Alert visibility.
- Operational status.

---

## NFR-USA-03 Error Messages

The system shall provide meaningful error messages.

Error messages should:

- Explain the problem.
- Guide users toward corrective actions.

---

# 4.9 Data Management Requirements

## NFR-DAT-01 Historical Data Preservation

The system shall preserve historical operational data.

Requirements:

- Telemetry history must remain available.
- Machine assignment history must remain traceable.
- Sensor assignment history must remain traceable.

---

## NFR-DAT-02 Data Retention

The system shall manage telemetry retention.

Policy:

| Data Type | Retention |
| --------- | --------- |
| Raw Telemetry | 6 Months |
| Summary Data | 5 Years |

---

## NFR-DAT-03 Data Backup

The system shall support data backup.

Backup objectives:

- Prevent permanent data loss.
- Support recovery after failures.

---

# 4.10 Monitoring and Logging Requirements

## NFR-MON-01 System Monitoring

The system shall provide monitoring capability for:

- Application health.
- Service availability.
- Processing status.

---

## NFR-MON-02 Application Logging

The system shall record application logs.

Logs include:

- Error logs.
- Warning logs.
- Operational logs.
- Security logs.

---

## NFR-MON-03 Audit Logging

The system shall maintain audit logs for:

- User activities.
- Data changes.
- Configuration changes.

---

# 4.11 Compatibility Requirements

## NFR-COM-01 Browser Support

The system should support modern browsers:

- Google Chrome.
- Microsoft Edge.
- Mozilla Firefox.

---

## NFR-COM-02 Industrial Protocol Compatibility

The system shall support:

- MQTT.
- OPC-UA.
- Modbus TCP.

---

# 4.12 Disaster Recovery Requirements

## NFR-DR-01 Backup Recovery

The system shall support restoration from backup.

---

## NFR-DR-02 Recovery Objective

Target recovery objectives:

| Metric | Target |
| ------ | ------ |
| RTO | ≤ 4 hours |
| RPO | ≤ 1 hour |

---

# 4.13 Compliance Requirements

## NFR-COM-PL-01 Operational Compliance

The system shall maintain traceability of:

- Asset history.
- Maintenance history.
- Incident history.
- User activities.

---

## NFR-COM-PL-02 Data Governance

The system shall ensure:

- Data consistency.
- Data traceability.
- Controlled access.

---

# 4.14 Non-Functional Requirement Summary

| Category | Main Requirement |
| -------- | ---------------- |
| Performance | Fast response and near real-time monitoring |
| Scalability | Support multiple factories and machines |
| Availability | Continuous monitoring capability |
| Reliability | Preserve operational data integrity |
| Security | Authentication and authorization control |
| Maintainability | Modular and traceable system design |
| Usability | Simple operational experience |
| Data Management | Historical data preservation |
| Monitoring | Logging and operational visibility |
| Recovery | Backup and disaster recovery |

---

# Revision History

| Version | Date | Author | Description |
| ------- | ---- | ------ | ----------- |
| 1.0 | 2026-08-07 | Business Analyst | Initial version |