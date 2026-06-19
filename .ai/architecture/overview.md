# System Overview

Project Name:
Factory Management System

Client
  |
API Gateway
  |
--------------------------------
|        |         |           |
Auth   Factory  Telemetry   Alarm
                     |
                  MQTT


Database:
- PostgreSQL

Cache:
- Redis

Communication:
- NestJS TCP Transport

Authentication:
- JWT

Authorization:
- Role
- Permission
- Factory Permission