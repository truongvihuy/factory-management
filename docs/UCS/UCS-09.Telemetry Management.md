# UCS-09. Telemetry Management

**Document Name:** Use Case Specification  
**Use Case ID:** UCS-09  
**Use Case Name:** Telemetry Management  
**Project:** Factory Management System (FMS)  
**Version:** 1.0  
**Status:** Draft

---

# 1. Use Case Overview

## 1.1 Description

The **Telemetry Management** use case describes how the Factory Management System collects, validates, stores, processes, and provides access to operational telemetry data collected from industrial machines.

Telemetry data is generated from sensors attached to machines and transmitted through IoT gateways using supported industrial communication protocols.

The system provides telemetry capabilities for:

- Real-time machine monitoring.
- Machine health analysis.
- Alert condition evaluation.
- Historical operational analysis.
- Reporting.

Telemetry Management ensures that operational data is stored consistently, traceably, and securely throughout the machine lifecycle.

---

# 2. Actors

| Actor                 | Description                                             |
| --------------------- | ------------------------------------------------------- |
| IoT Gateway           | Sends telemetry data from industrial devices            |
| Sensor                | Generates machine measurement data                      |
| System                | Receives, validates, processes, and stores telemetry    |
| Factory Manager       | Views telemetry information within authorized factories |
| Production Supervisor | Monitors machine operational conditions                 |
| Maintenance Engineer  | Uses telemetry data for troubleshooting                 |
| Operator              | Monitors assigned machine status                        |

---

# 3. Use Case Scope

This use case covers:

- Receive telemetry data.
- Validate telemetry data.
- Process telemetry messages.
- Store telemetry history.
- Display real-time telemetry.
- View historical telemetry.
- Search telemetry records.
- Archive telemetry data.
- Retrieve archived telemetry.

This use case does not cover:

- Sensor registration.
- Machine registration.
- Alert rule configuration.
- Notification processing.
- Dashboard configuration.

Related use cases:

- UCS-07 Machine Management.
- UCS-08 Sensor Management.
- UCS-10 Alert Management.
- UCS-14 Dashboard & Monitoring.
- UCS-15 Reporting & Analytics.

---

# 4. Preconditions

Before executing this use case:

1. Sensor must exist in the system.
2. Sensor must be assigned to a Machine.
3. Machine must be active.
4. IoT Gateway must be registered and connected.
5. Communication protocol must be supported.
6. System must be available.

---

# 5. Trigger

The use case is triggered when:

- A sensor sends new telemetry data.
- A gateway forwards telemetry messages.
- A user requests telemetry history.
- Scheduled archival process runs.

---

# 6. Supported Communication Protocols

The system supports telemetry collection through:

| Protocol   | Description                               |
| ---------- | ----------------------------------------- |
| MQTT       | Lightweight IoT messaging protocol        |
| OPC-UA     | Industrial machine communication protocol |
| Modbus TCP | Industrial device communication protocol  |

---

# 7. Main Success Flow

# 7.1 Receive Telemetry Data

| Step | Actor Action                      | System Response                     |
| ---- | --------------------------------- | ----------------------------------- |
| 1    | Sensor collects machine data      | Sensor generates telemetry message  |
| 2    | Gateway receives telemetry        | Gateway forwards data to system     |
| 3    | System receives telemetry message | System validates message format     |
| 4    | System identifies sensor          | System verifies sensor ownership    |
| 5    | System identifies machine         | System links telemetry to machine   |
| 6    | System stores telemetry data      | Telemetry record is created         |
| 7    | System updates machine status     | Latest machine condition is updated |
| 8    | System evaluates alert conditions | Alert processing is triggered       |

---

# 7.2 Validate Telemetry Data

| Step | Actor Action                  | System Response                 |
| ---- | ----------------------------- | ------------------------------- |
| 1    | System receives telemetry     | System validates payload        |
| 2    | System checks required fields | Validation is performed         |
| 3    | System checks timestamp       | Timestamp validity is verified  |
| 4    | System checks sensor status   | Sensor availability is verified |
| 5    | System accepts valid data     | Telemetry continues processing  |

---

# 7.3 Store Telemetry Data

| Step | Actor Action                    | System Response                               |
| ---- | ------------------------------- | --------------------------------------------- |
| 1    | Valid telemetry is received     | System prepares storage                       |
| 2    | System creates telemetry record | Data is stored                                |
| 3    | System associates data          | Sensor and Machine relationship is maintained |
| 4    | System records timestamp        | Historical traceability is ensured            |

---

# 7.4 View Real-Time Telemetry

| Step | Actor Action                  | System Response                   |
| ---- | ----------------------------- | --------------------------------- |
| 1    | User selects machine          | System retrieves latest telemetry |
| 2    | User requests monitoring data | System returns current values     |
| 3    | System displays information   | Latest machine condition is shown |

Displayed information includes:

- Machine status.
- Temperature.
- Vibration.
- Pressure.
- Speed.
- Current.
- Voltage.
- Power.
- Energy consumption.
- Last update time.

---

# 7.5 View Historical Telemetry

| Step | Actor Action              | System Response                   |
| ---- | ------------------------- | --------------------------------- |
| 1    | User selects machine      | System loads telemetry history    |
| 2    | User specifies time range | System filters data               |
| 3    | System retrieves records  | Historical telemetry is displayed |

Search criteria:

- Machine.
- Sensor.
- Date range.
- Telemetry type.

---

# 7.6 Archive Telemetry Data

| Step | Actor Action                    | System Response                    |
| ---- | ------------------------------- | ---------------------------------- |
| 1    | Retention period is reached     | Scheduled process starts           |
| 2    | System identifies old telemetry | Data is selected                   |
| 3    | System archives telemetry       | Data is moved to archive storage   |
| 4    | System maintains references     | Historical query remains available |

---

# 8. Alternative Flows

# AF-01 Invalid Telemetry Format

### Condition

Telemetry message does not match required format.

Flow:

| Step | Actor Action               | System Response           |
| ---- | -------------------------- | ------------------------- |
| 1    | Gateway sends telemetry    | System validates payload  |
| 2    | Invalid structure detected | Message rejected          |
| 3    | System records error       | Validation failure logged |

---

# AF-02 Unknown Sensor

### Condition

Telemetry is received from an unregistered sensor.

Flow:

| Step | Actor Action              | System Response              |
| ---- | ------------------------- | ---------------------------- |
| 1    | System receives telemetry | Sensor identification starts |
| 2    | Sensor not found          | Data ingestion rejected      |
| 3    | System records warning    | Unknown device event logged  |

---

# AF-03 Offline Gateway

### Condition

Gateway loses connection.

Flow:

| Step | Actor Action              | System Response                   |
| ---- | ------------------------- | --------------------------------- |
| 1    | Gateway disconnects       | System detects communication loss |
| 2    | Telemetry stops receiving | Machine status updated            |
| 3    | System records event      | Connectivity issue stored         |

---

# 9. Exception Flows

# EF-01 Storage Failure

### Condition

System cannot store telemetry data.

Flow:

| Step | Actor Action             | System Response            |
| ---- | ------------------------ | -------------------------- |
| 1    | Valid telemetry received | Storage transaction starts |
| 2    | Storage failure occurs   | Transaction rollback       |
| 3    | System records error     | Failure is logged          |

---

# EF-02 System Unavailable

### Condition

Telemetry service is unavailable.

Flow:

| Step | Actor Action            | System Response                 |
| ---- | ----------------------- | ------------------------------- |
| 1    | Gateway sends telemetry | System unavailable              |
| 2    | Gateway buffers data    | Data temporarily stored         |
| 3    | System recovers         | Buffered telemetry is processed |

---

# 10. Business Rules

## BR-TM-001 Telemetry Ownership

Telemetry data must belong to:

```

Machine
│
└── Sensor
│
└── Telemetry

```

---

## BR-TM-002 Telemetry Immutability

Telemetry data is append-only.

The system shall not allow:

- Updating telemetry records.
- Deleting telemetry records manually.

---

## BR-TM-003 Historical Traceability

Historical telemetry must remain associated with the original Machine where it was collected.

Example:

```

Machine A
|
Sensor A
|
Telemetry History

Sensor moved to Machine B

Machine A telemetry remains unchanged

```

---

## BR-TM-004 Telemetry Timestamp

Every telemetry record must contain:

- Collection timestamp.
- Device timestamp (if available).
- Storage timestamp.

---

## BR-TM-005 Data Retention

Telemetry retention policy:

| Data Type     | Retention |
| ------------- | --------- |
| Raw Telemetry | 6 Months  |
| Summary Data  | 5 Years   |

---

## BR-TM-006 Supported Telemetry Types

The system supports:

- Temperature.
- Vibration.
- Pressure.
- Humidity.
- Speed.
- Current.
- Voltage.
- Power.
- Energy Consumption.
- Machine Status.

---

# 11. Data Requirements

## Telemetry Entity

| Field              | Description           |
| ------------------ | --------------------- |
| Telemetry ID       | Unique identifier     |
| Machine ID         | Related machine       |
| Sensor ID          | Source sensor         |
| Metric Type        | Measurement type      |
| Metric Value       | Measurement value     |
| Unit               | Measurement unit      |
| Device Timestamp   | Timestamp from device |
| Received Timestamp | System received time  |
| Created Date       | Storage timestamp     |

---

## Telemetry Archive Entity

| Field               | Description        |
| ------------------- | ------------------ |
| Archive ID          | Unique identifier  |
| Telemetry Reference | Original telemetry |
| Archive Date        | Archived date      |
| Storage Location    | Archive location   |

---

# 12. Input Requirements

| Input        | Required |
| ------------ | -------- |
| Sensor ID    | Yes      |
| Machine ID   | Yes      |
| Metric Type  | Yes      |
| Metric Value | Yes      |
| Timestamp    | Yes      |
| Unit         | No       |

---

# 13. Output Requirements

The system provides:

- Latest machine telemetry.
- Historical telemetry.
- Telemetry trends.
- Telemetry search results.
- Archived telemetry.

---

# 14. Postconditions

## Successful Execution

After completion:

- Telemetry data is stored.
- Machine status is updated.
- Historical records are maintained.
- Data is available for monitoring and analysis.

---

## Failed Execution

After failure:

- Invalid telemetry is rejected.
- Error is recorded.
- Existing telemetry remains unchanged.

---

# 15. Acceptance Criteria

## AC-01 Receive Telemetry

Given:

- Valid sensor exists.
- Machine is active.

When:

- Sensor sends telemetry.

Then:

- System stores telemetry successfully.

---

## AC-02 Real-Time Monitoring

Given:

- Machine has active sensors.

When:

- Telemetry is received.

Then:

- Latest machine status is updated.

---

## AC-03 Historical Query

Given:

- Telemetry exists.

When:

- User searches telemetry history.

Then:

- System returns matching records.

---

## AC-04 Data Retention

Given:

- Telemetry exceeds retention period.

When:

- Archive process executes.

Then:

- Data is archived successfully.

---

## AC-05 Data Integrity

Given:

- Historical telemetry exists.

When:

- Sensor assignment changes.

Then:

- Historical telemetry remains unchanged.

---

# 16. Related Requirements

| Requirement            | Reference |
| ---------------------- | --------- |
| Sensor Management      | UCS-08    |
| Machine Management     | UCS-07    |
| Alert Management       | UCS-10    |
| Dashboard & Monitoring | UCS-14    |
| Reporting & Analytics  | UCS-15    |
| Data Retention         | UCS-21    |

---

# Revision History

| Version | Date       | Author           | Description     |
| ------- | ---------- | ---------------- | --------------- |
| 1.0     | 2026-08-07 | Business Analyst | Initial version |
