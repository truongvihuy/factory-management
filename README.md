# Factory Management Platform

## Overview

Factory Management Platform is a modern Industrial IoT platform designed to monitor, manage, and analyze factory operations in real time.

The platform provides end-to-end visibility across factories, workshops, machines, sensors, and devices through a scalable event-driven architecture.

### Key Capabilities

- Factory Asset Management
- Realtime Telemetry Collection
- Equipment Monitoring
- Alarm Detection & Notification
- Maintenance Management
- Production Analytics
- Energy Analytics
- KPI & OEE Dashboards
- Digital Twin Visualization (Planned)
- AI Predictive Maintenance (Planned)

---

# Business Problem

Many factories still rely on manual monitoring processes, resulting in:

- Delayed incident detection
- Unplanned equipment downtime
- High maintenance costs
- Limited operational visibility
- Inefficient energy consumption

This platform aims to digitize factory operations and provide real-time insights for operational excellence.

---

# Technology Stack

## Backend

- Node.js
- NestJS
- TypeScript

## Database

- PostgreSQL

## Realtime

- MQTT (EMQX)
- Redis
- Socket.IO

## Infrastructure

- Docker
- Docker Compose

---

# Architecture Overview

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

# Why This Architecture?

## MQTT

Selected because:

- Lightweight protocol for IoT devices
- Low bandwidth usage
- Publish / Subscribe model
- High scalability

## Redis

Selected because:

- Sub-millisecond latency
- Realtime caching
- Pub/Sub support
- Fast alarm evaluation

## PostgreSQL

Selected because:

- ACID compliance
- Strong relational modeling
- Reliable transactional processing

## NestJS

Selected because:

- Modular architecture
- Dependency Injection
- Enterprise-grade scalability
- Strong TypeScript support

---

# System Architecture

## Core Business Flow

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

## Realtime Data Flow

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

# Development Roadmap

## Phase 1 - Foundation & Asset Management

### Modules

- Authentication
- User Management
- RBAC
- Factory Management
- Workshop Management
- Machine Management
- Sensor Management
- Device Management

### Objective

Build the core factory hierarchy and asset structure.

---

## Phase 2 - Realtime Monitoring

### Modules

- MQTT Integration
- Telemetry Processing
- Redis Cache
- WebSocket Gateway
- Realtime Dashboard

### Objective

Collect and visualize sensor data in real time.

---

## Phase 3 - Alarm Management

### Modules

- Alarm Rules
- Alarm Engine
- Alarm Dashboard
- Notification Service

### Objective

Automatically detect abnormal equipment behavior.

---

## Phase 4 - Maintenance Management

### Modules

- Maintenance Plans
- Maintenance Tickets
- Scheduling
- Maintenance History

### Objective

Support preventive and corrective maintenance workflows.

---

## Phase 5 - Analytics & Reporting

### Modules

- Production Analytics
- Energy Analytics
- KPI Dashboard
- OEE Dashboard
- Export Reports

### Objective

Deliver operational insights and performance measurements.

---

## Phase 6 - Digital Twin (Planned)

### Modules

- Factory Mapping
- Machine Mapping
- 3D Visualization
- Realtime Overlay

---

## Phase 7 - AI Features (Planned)

### Modules

- Predictive Maintenance
- AI Anomaly Detection
- Failure Prediction
- Energy Optimization

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

# Shared Libraries

```text
libs/

├── common/
├── database/
├── logger/
├── mqtt/
├── redis/
├── websocket/
├── auth/
└── events/
```

---

# Event Driven Design

Example domain events:

```text
TelemetryReceivedEvent

AlarmCreatedEvent

AlarmResolvedEvent

MaintenanceTicketCreatedEvent

MaintenanceCompletedEvent
```

Services communicate through events rather than direct dependencies whenever possible.

---

# Security Strategy

- JWT Authentication
- Refresh Token
- Role-Based Access Control (RBAC)
- Request Validation
- Audit Logging
- Secure MQTT Authentication
- API Rate Limiting

---

# Observability

Metrics collected:

- API Response Time
- MQTT Throughput
- Redis Hit/Miss Ratio
- Alarm Processing Time
- Active WebSocket Connections
- Database Query Performance

---

# CI/CD Pipeline

```text
Developer
   ↓
GitHub
   ↓
GitHub Actions
   ↓
Build
   ↓
Test
   ↓
Docker Image
   ↓
Deployment
```

---

# Scalability Strategy

Future scaling plan:

- EMQX Cluster
- Redis Cluster
- Kubernetes Deployment
- TimescaleDB
- Kafka Event Streaming
- Multi-Factory Architecture
- Multi-Tenant Support

---

# Non-Functional Requirements

- Realtime latency < 1 second
- Horizontal scaling ready
- High availability architecture
- Event-driven processing
- Observability by design
- Microservice-ready structure

---

# Project Status

Current Phase: Realtime Monitoring

Completed:

- Authentication
- RBAC
- Factory Management
- MQTT Integration
- Telemetry Processing
- Redis Integration

In Progress:

- Alarm Engine
- WebSocket Dashboard

Planned:

- Maintenance Management
- Analytics
- Digital Twin
- AI Predictive Maintenance

---

# Engineering Principles

1. Domain-Oriented Design
2. Event-Driven Architecture
3. Realtime-First Approach
4. Microservice-Ready Structure
5. Scalability by Design
6. Observability First
7. Clean Architecture
8. Separation of Concerns

---

# Author

Truong Vi Huy

Backend Engineer | Fullstack Engineer (Backend Focus)

Tech Stack:

NestJS • PostgreSQL • Redis • MQTT • Socket.IO • Docker
