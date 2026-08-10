# Auth Service Boundaries

## 1. Purpose

This document defines the business boundaries, responsibilities, ownership, and dependencies of the Auth Service within the Factory Management System (FMS).

The Auth Service is responsible for identity, authentication, authorization, and session management.

It is the authoritative owner of identity and access-control data.

The service must remain independent from operational factory domains such as machines, telemetry, maintenance, incidents, and alerts.

---

# 2. Auth Service Responsibility

The Auth Service provides the following capabilities:

```text
Auth Service
│
├── User Management
├── Authentication
├── Authorization
├── Role Management
├── Permission Management
└── Session Management
```

Its primary responsibility is:

> Determine who the user is, what the user is allowed to do, and whether the user's authentication session is valid.

---

# 3. Domain Boundaries

The Auth Service contains the following domains:

| Domain         | Responsibility                     |
| -------------- | ---------------------------------- |
| Users          | User identity and lifecycle        |
| Authentication | Login and authentication workflows |
| Roles          | Role definition and assignment     |
| Permissions    | Permission definition              |
| Sessions       | Authenticated session lifecycle    |

These domains are related but have distinct responsibilities.

---

# 4. User Domain

## 4.1 Responsibility

The User domain owns the identity of users within the FMS.

It manages:

- User identity
- User profile
- Account status
- Email / username identity
- User lifecycle
- Credential association

---

## 4.2 User Ownership

Auth Service is the authoritative owner of the User entity.

```text
Auth Service
     │
     ▼
    User
```

Other services may store a `userId` reference but must not become the owner of the user.

---

## 4.3 User Lifecycle

A user may move through states such as:

```text
Created
   │
   ▼
Active
   │
   ├──► Disabled
   │
   └──► Suspended
```

The exact lifecycle states are defined by the authentication and authorization requirements.

---

# 5. Authentication Domain

## 5.1 Responsibility

The Authentication domain verifies user identity and establishes authenticated access.

It manages:

- Login
- Credential verification
- Authentication attempts
- Access token issuance
- Refresh token handling
- Logout
- Authentication-related security policies

---

## 5.2 Authentication Does Not Own Users

Authentication operates on users but does not replace the User domain.

```text
Authentication
      │
      ▼
    User
```

The User domain remains responsible for user identity and lifecycle.

---

# 6. Authorization Domain

Authorization determines whether an authenticated user is allowed to perform an operation.

The authorization model is based on:

```text
User
  │
  ▼
Role
  │
  ▼
Permission
```

---

# 7. Role Domain

## 7.1 Responsibility

The Role domain manages roles assigned to users.

Examples:

```text
Factory Manager
Production Supervisor
Maintenance Engineer
Operator
Board of Directors
```

Roles represent a collection of permissions.

---

## 7.2 Role Ownership

Auth Service owns:

- Role definition
- Role status
- Role assignment
- Role-permission relationships

Example:

```text
User
 │
 └── UserRole
       │
       ▼
     Role
       │
       └── RolePermission
                │
                ▼
            Permission
```

---

# 8. Permission Domain

## 8.1 Responsibility

The Permission domain defines atomic access capabilities.

Examples:

```text
machine.read
machine.create
machine.update
machine.delete

alert.read
alert.acknowledge

maintenance.read
maintenance.create

incident.read
incident.update
```

Permissions describe what an actor can do.

---

## 8.2 Permission Ownership

Auth Service owns permission definitions.

However, the business services own the meaning and implementation of their business operations.

For example:

```text
Auth Service
    │
    └── machine.update
```

defines the permission.

But:

```text
Factory Service
    │
    └── Update Machine
```

implements the actual machine operation.

Therefore:

> Auth Service owns access-control metadata, while the target business service owns the business operation.

---

# 9. Session Domain

## 9.1 Responsibility

The Session domain manages authenticated user sessions.

It is responsible for:

- Session creation
- Session validation
- Session expiration
- Session revocation
- Logout
- Refresh-token lifecycle where applicable
- Session security metadata

---

## 9.2 Session Storage

Runtime session state should be stored in Redis.

```text
Auth Service
     │
     ▼
   Redis
     │
     └── Session State
```

Persistent identity and authorization data remain in PostgreSQL.

```text
Auth Service
     │
     ├── PostgreSQL
     │      └── Users / Roles / Permissions
     │
     └── Redis
            └── Runtime Sessions
```

This separates durable identity data from short-lived authentication state.

---

# 10. Credentials

Credentials are part of the Auth Service boundary.

Auth Service owns:

- Password hashes
- Credential status
- Password-related security metadata
- Credential lifecycle

Plain-text passwords must never be stored.

---

# 11. What Auth Service Owns

The authoritative ownership list is:

```text
Auth Service
│
├── User
├── Credential
├── Role
├── Permission
├── UserRole
├── RolePermission
└── Session
```

Session runtime state may reside in Redis.

---

# 12. What Auth Service Does Not Own

Auth Service explicitly does **not** own:

```text
Organization
Factory
Production Line
Machine
Sensor
Telemetry
Alert
Maintenance
Incident
Report
Audit Record
```

Ownership belongs to other services.

---

# 13. Cross-Service Domain Ownership

```text
Auth
├── User
├── Credential
├── Role
├── Permission
└── Session

Factory
├── Organization
├── Factory
├── Production Line
├── Machine
└── Sensor

Telemetry
└── Telemetry

Alert
├── Alert Rule
└── Alert

Maintenance
├── Maintenance Plan
└── Maintenance Task

Incident
└── Incident

Reporting
└── Reporting Models

Audit
└── Audit Record
```

---

# 14. Database Ownership

Auth Service owns its own PostgreSQL database.

```text
Auth Service
     │
     ▼
Auth PostgreSQL
```

No other service may directly access this database.

Forbidden:

```text
Factory Service
      │
      ▼
Auth PostgreSQL
```

Required:

```text
Factory Service
      │
      ├── gRPC
      │
      └── Events
             │
             ▼
         Auth Service
```

---

# 15. Cross-Service User References

Other services may need to identify the user who performed an operation.

They should store:

```text
userId
```

as an external reference.

Example:

```text
Incident
├── id
├── machineId
├── createdBy
└── ...
```

`createdBy` identifies the user owned by Auth Service.

It must not create a database foreign key to the Auth database.

---

# 16. Authentication Boundary

Authentication requests enter through the API Gateway.

```text
Client
   │
   │ REST / HTTPS
   ▼
API Gateway
   │
   │ gRPC
   ▼
Auth Service
   │
   ├── PostgreSQL
   └── Redis
```

The client should not directly communicate with the internal Auth Service.

---

# 17. Authorization Boundary

Authorization has two responsibilities.

### Auth Service

Determines:

```text
Who is this user?
What roles does the user have?
What permissions does the user have?
Is the authentication state valid?
```

### Business Service

Determines:

```text
What does this operation mean?
Is this state transition valid?
Can this domain operation be performed?
```

Example:

```text
Client
  │
  ▼
API Gateway
  │
  ▼
Factory Service
  │
  ├── Authentication / authorization context
  │
  └── Business rule
        │
        ▼
    Update Machine
```

Authentication authorization and domain authorization should not be confused.

---

# 18. Authentication vs Business Authorization

These are different concerns.

### Authentication

```text
"Who are you?"
```

Handled by Auth Service.

### Authorization

```text
"Are you allowed to perform this action?"
```

Access-control information comes from Auth Service.

### Domain Validation

```text
"Is this action valid according to the business?"
```

Handled by the business service.

Example:

A user may have:

```text
machine.update
```

but Factory Service may still reject the operation because:

```text
Machine is currently locked
```

That is a business rule, not an authentication rule.

---

# 19. Internal Communication

Auth Service exposes internal capabilities through gRPC.

Potential capabilities include:

```text
ValidateToken
GetUser
GetUserRoles
GetUserPermissions
CheckPermission
```

The final contract should be defined during the gRPC implementation task.

---

# 20. Asynchronous Communication

Auth Service may publish identity-related domain events.

Examples:

```text
user.created
user.updated
user.disabled

role.created
role.updated

permission.updated
```

These events allow other services to react without tightly coupling themselves to Auth Service.

---

# 21. Events Auth Service Should Not Publish

Auth Service must not publish events about domains it does not own.

For example:

```text
machine.updated
telemetry.received
alert.created
maintenance.completed
incident.resolved
```

Those events belong to their respective domain owners.

---

# 22. Dependency Direction

The Auth Service follows:

```text
Presentation
     │
     ▼
Application
     │
     ▼
Domain
     ▲
     │
Infrastructure
```

Business logic must not depend directly on:

- Prisma
- Redis client
- RabbitMQ client
- HTTP framework implementation
- gRPC transport implementation

Infrastructure implements required abstractions.

---

# 23. Internal Module Boundaries

The Auth Service should initially contain:

```text
modules/
├── users/
├── authentication/
├── roles/
├── permissions/
└── sessions/
```

Each module should have a clear responsibility.

---

# 24. User Module

```text
users/
```

Owns:

- User identity
- User lifecycle
- User profile
- Account status

Does not own:

- Login workflow
- Session state
- Permission evaluation

---

# 25. Authentication Module

```text
authentication/
```

Owns:

- Login
- Credential verification
- Token issuance
- Logout
- Authentication workflow

Depends conceptually on:

```text
Users
Credentials
Sessions
```

---

# 26. Roles Module

```text
roles/
```

Owns:

- Role definition
- Role assignment
- Role lifecycle

---

# 27. Permissions Module

```text
permissions/
```

Owns:

- Permission definition
- Permission lifecycle
- Role-permission relationships

---

# 28. Sessions Module

```text
sessions/
```

Owns:

- Session lifecycle
- Session validation
- Session revocation
- Session expiration

Runtime state is backed by Redis.

---

# 29. Module Dependency Model

Recommended dependency direction:

```text
                 Authentication
                  /     |     \
                 ▼      ▼      ▼
              Users   Sessions  Roles
                                │
                                ▼
                           Permissions
```

However, dependencies should remain explicit and minimal.

Avoid circular dependencies such as:

```text
Users
  ↓
Authentication
  ↓
Users
```

---

# 30. Security Boundary

Auth Service is a security-sensitive service.

It is responsible for protecting:

- Credentials
- Authentication tokens
- Session state
- Authorization metadata
- Authentication-related security events

Sensitive information must not appear in logs.

Examples of information that must not be logged:

```text
Password
Password hash
Access token
Refresh token
Session secret
Credentials
```

---

# 31. Audit Boundary

Auth Service does not own the global audit trail.

Instead, it publishes relevant events.

```text
Auth Service
     │
     │ user.created
     │ user.disabled
     │ login-related events
     ▼
RabbitMQ
     │
     ▼
Audit Service
```

Audit Service owns the resulting audit records.

---

# 32. Failure Boundary

Auth Service failure should not corrupt other service databases.

For example:

```text
Auth Service DOWN
```

should not cause:

```text
Factory DB corruption
Telemetry DB corruption
Maintenance DB corruption
```

Services should fail according to their own dependency requirements.

---

# 33. Scaling Boundary

Auth Service must be horizontally scalable.

```text
                 Load Balancer
                      │
          ┌───────────┼───────────┐
          ▼           ▼           ▼
       Auth #1     Auth #2     Auth #3
          │           │           │
          └───────────┼───────────┘
                      │
             ┌────────┴────────┐
             ▼                 ▼
        PostgreSQL           Redis
```

Session state must therefore not depend on process-local memory.

---

# 34. Stateless Application Principle

Auth Service application instances should remain stateless where practical.

Avoid:

```typescript
const sessions = new Map();
```

because:

- Instances do not share state.
- Restart loses state.
- Horizontal scaling becomes inconsistent.

Use Redis for shared runtime session state.

---

# 35. Boundary Rules

The following rules are mandatory:

### Rule 1

Auth Service owns identity.

### Rule 2

Auth Service owns authentication.

### Rule 3

Auth Service owns authorization metadata.

### Rule 4

Auth Service owns session lifecycle.

### Rule 5

Auth Service owns credentials.

### Rule 6

Auth Service does not own business domains.

### Rule 7

Other services must not access Auth PostgreSQL directly.

### Rule 8

Other services reference users through identifiers.

### Rule 9

Authentication and authorization logic must not be duplicated across services.

### Rule 10

Business rules remain in the owning business service.

---

# 36. Final Boundary Model

```text
                         Auth Service
                              │
             ┌────────────────┼────────────────┐
             │                │                │
             ▼                ▼                ▼
           Users       Authentication      Authorization
             │                │                │
             │                ▼                ├── Roles
             │             Sessions            └── Permissions
             │                │
             └────────────────┼────────────────┘
                              │
                     ┌────────┴────────┐
                     ▼                 ▼
                PostgreSQL           Redis
                     │
                     │
                     ▼
              Durable Identity
              & Access Data
```

External interaction:

```text
Client
  │
  │ REST
  ▼
API Gateway
  │
  │ gRPC
  ▼
Auth Service
```

Event interaction:

```text
Auth Service
      │
      │ Domain Events
      ▼
  RabbitMQ
      │
      ├──► Audit Service
      ├──► Reporting Service
      └──► Other Consumers
```

---

# 37. Final Principle

The Auth Service answers three fundamental questions:

```text
WHO are you?
        │
        ▼
    Authentication

WHAT can you do?
        │
        ▼
    Authorization

IS your access still valid?
        │
        ▼
      Session
```

Everything outside these responsibilities belongs to another service.

The architectural boundary is therefore:

> **Auth Service owns identity, authentication, authorization metadata, credentials, and sessions. It provides security capabilities to the rest of the platform but does not own operational business domains.**
