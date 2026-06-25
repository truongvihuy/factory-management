# Factory Management Platform

## Overview

The Factory Management Platform is a real-time industrial monitoring and management system designed to provide visibility into factory operations through IoT telemetry, maintenance management, alarms, analytics, ...

The platform enables:

* Factory, workshop, machine, sensor and device management
* Real-time telemetry collection
* Equipment monitoring and alarming
* Maintenance planning and ticket management
* Production performance analytics
* Energy consumption analytics
* Digital Twin visualization (expected)
* Future AI-powered predictive maintenance (expected)

---

# Technology Stack

## Backend

* Node.js
* NestJS
* TypeScript

## Database

* PostgreSQL

## Realtime Technologies

* MQTT (EMQX)
* Redis
* Socket.IO

## Infrastructure

* Docker
* Docker Compose

## Monitoring

* Prometheus
* Grafana

---

# System Architecture

```text
Sensors
   ↓
MQTT Broker (EMQX)
   ↓
Telemetry Service
   ↓
Redis
   ├── Alarm Service
   ├── Analytics Service
   └── WebSocket Gateway
               ↓
          Frontend Dashboard

Telemetry History
        ↓
     PostgreSQL
```

---

# Development Roadmap

## Phase 1 - Foundation & Asset Management

### Modules

* Authentication
* User Management
* Role & Permission Management
* Factory Management
* Workshop Management
* Machine Management
* Sensor Management
* Device Management

### Objective

Build the core data model and organizational structure of the factory.

---

## Phase 2 - Realtime Monitoring

### Modules

* MQTT Integration
* Telemetry Ingestion
* Redis Cache
* WebSocket Gateway
* Realtime Dashboard

### Objective

Collect and visualize sensor data in real time.

---

## Phase 3 - Alarm Management

### Modules

* Alarm Rules
* Alarm Engine
* Notification System
* Alarm Dashboard

### Objective

Automatically detect abnormal machine behavior and notify users.

---

## Phase 4 - Maintenance Management

### Modules

* Maintenance Plans
* Maintenance Tickets
* Maintenance History
* Ticket Assignment

### Objective

Manage preventive and corrective maintenance processes.

---

## Phase 5 - Analytics & Reporting

### Modules

* Production Analytics
* Energy Analytics
* KPI Dashboard
* OEE Dashboard
* Export Reports

### Objective

Provide operational insights and performance measurements.

---

## Phase 6 - Visualization (expected)

### Modules

* 3D Factory Models
* Machine Mapping
* 360° Images
* Realtime Overlay

### Objective

Provide a visual representation of the factory and machine status.

---

## Phase 7 - AI & Advanced Features

### Modules

* Predictive Maintenance
* AI Anomaly Detection
* Failure Prediction
* Energy Optimization

### Objective

Transform monitoring into prediction and optimization.

---

# Monorepo Structure

```text
backend/

├── apps/
├── libs/
├── infrastructure/
├── deployments/
├── docs/
├── prisma/
└── scripts/

```

---

# Applications

Each folder inside `apps` represents an independent NestJS application or microservice.

```text
apps/

├── api-gateway/
├── auth-service/
├── factory-service/
├── telemetry-service/
├── alarm-service/
├── maintenance-service/
├── analytics-service/
└── notification-service/
```

---

## API Gateway

Responsibilities:

* Authentication
* Authorization
* Request routing
* API aggregation
* WebSocket gateway

---

## Auth Service

Responsibilities:

* Login
* JWT Authentication
* Refresh Tokens
* User Roles / User Permissions

---

## Factory Service

Responsibilities:

* Factories
* Workshops
* Machines
* Sensors
* Devices

---

## Telemetry Service

Responsibilities:

* MQTT Consumers
* Telemetry Processing
* Data Validation
* Redis Updates
* Historical Storage

---

## Alarm Service

Responsibilities:

* Alarm Rules
* Alarm Evaluation
* Alarm History
* Alarm Notifications

---

## Maintenance Service

Responsibilities:

* Maintenance Plans
* Maintenance Tickets
* Maintenance Scheduling
* Maintenance History

---

## Analytics Service

Responsibilities:

* Production Analytics
* Energy Analytics
* KPI Calculation
* OEE Calculation
* Reporting

---

## Notification Service

Responsibilities:

* Email Notifications
* In-App Notifications
* Future SMS/Push Notifications

---

# Shared Libraries

```text
libs/

├── common/
├── database/
├── logger/
├── mqtt/
├── redis/
├── auth/
└── events/
```

---

## Common

Shared code across all services:

* Enums
* Constants
* Decorators
* Middlewares
* Guards
* Interceptors
* Exceptions
* Filters
* ~~DTOs~~

---

## Database

Shared database utilities:

* Database connections
* ~~Base repositories~~
* ~~Shared entities~~

---

## Logger

Centralized logging configuration.

Recommended:

* Pino
* Winston

---

## MQTT

Shared MQTT client wrapper and utilities.

---

## Redis

Shared Redis client and cache utilities.

---

## WebSocket

Shared Socket.IO gateway configuration.

---

## Auth

Shared authentication logic:

* JWT Strategies
* Guards
* Role Decorators

---

## Events

Shared domain events.

Examples:

```text
TelemetryReceivedEvent
AlarmCreatedEvent
MaintenanceTicketCreatedEvent
MaintenanceCompletedEvent
```

---

# Infrastructure

Infrastructure resources and local development services.

```text
infrastructure/

└── docker/
```

---

# Core Business Flow

```text
Factory
   ↓
Workshop
   ↓
Machine
   ↓
Sensor / Device
   ↓
Telemetry
   ↓
Alarm
   ↓
Maintenance
   ↓
Analytics
```

---

# Realtime Data Flow

```text
Sensor
   ↓
MQTT Broker
   ↓
Telemetry Service
   ↓
Redis
   ↓
WebSocket Gateway
   ↓
Frontend Dashboard
```

---

# Database Strategy

## Operational Database

PostgreSQL stores:

* Factories
* Workshops
* Machines
* Sensors
* Devices
* Alarms
* Maintenance Records

---

## Telemetry Storage

MVP:

```text
PostgreSQL
```

Future Scaling:

```text
TimescaleDB
or
InfluxDB
```

For:

* High-volume telemetry
* Time-series analytics
* Retention policies
* Data aggregation

---

# Future Enhancements

* Predictive Maintenance
* AI Anomaly Detection
* Failure Prediction
* Energy Optimization
* Spare Parts Management
* AR-Assisted Maintenance
* Digital Twin Replay
* Multi-Factory Analytics
* Enterprise Reporting

---

# Engineering Principles

1. Domain-Oriented Design
2. Event-Driven Architecture
3. Realtime-First Approach
4. Microservice-Ready Structure
5. Scalability by Design
6. Observability and Monitoring
7. Clean Architecture and Separation of Concerns
