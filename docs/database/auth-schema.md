# Auth Service — Database Schema

## 1. Overview

The Auth Service owns the authentication and authorization data of the Factory Management System (FMS).

The database is responsible for:

* User identity and account security
* Role definitions
* Permission definitions
* Role-to-permission assignments
* User-to-role assignments
* Factory-scoped authorization
* User access to factories
* Authorization assignment lifecycle

The Auth Service **does not own Factory data**.

Factory records are owned by the corresponding domain service. Therefore, `factoryId` values stored in the Auth database are external identifiers and are intentionally **not represented as PostgreSQL foreign keys**.

---

# 2. Authorization Model

The authorization model separates four concepts:

```text
USER
 │
 ├── Factory Access
 │       │
 │       └── Factory
 │
 └── Role Assignment
         │
         ├── Factory Scope
         │
         └── Role
               │
               └── Permission
```

The model answers four different questions:

| Concept        | Question                                |
| -------------- | --------------------------------------- |
| User           | Who is making the request?              |
| Factory Access | Where can the user operate?             |
| Role           | What responsibility does the user have? |
| Permission     | What action can the user perform?       |

Authorization therefore follows:

```text
User
  ↓
Factory Access
  ↓
Factory Context
  ↓
Role Assignment
  ↓
Role
  ↓
Permission
  ↓
Allow / Deny
```

---

# 3. Entity Overview

The Auth database contains the following primary entities:

```text
users
roles
permissions
user_roles
role_permissions
user_factory_access
```

Relationship overview:

```text
                  ┌──────────────┐
                  │     User     │
                  └──────┬───────┘
                         │
             ┌───────────┴───────────┐
             │                       │
             ▼                       ▼
 ┌─────────────────────┐   ┌────────────────────┐
 │ UserFactoryAccess   │   │     UserRole       │
 └──────────┬──────────┘   └─────────┬──────────┘
            │                        │
            │                        ▼
            │                 ┌──────────────┐
            │                 │     Role     │
            │                 └──────┬───────┘
            │                        │
            │                        ▼
            │              ┌──────────────────┐
            │              │ RolePermission   │
            │              └────────┬─────────┘
            │                       │
            │                       ▼
            │              ┌──────────────────┐
            │              │   Permission     │
            │              └──────────────────┘
            │
            ▼
       External Factory
       Domain Service
```

---

# 4. Users

Table:

```text
users
```

Purpose:

Stores user identity and account security information.

### Main fields

| Field                 | Type         | Purpose                           |
| --------------------- | ------------ | --------------------------------- |
| `id`                  | UUID         | User identifier                   |
| `username`            | VARCHAR(100) | Unique login identifier           |
| `email`               | VARCHAR(255) | Unique email                      |
| `displayName`         | VARCHAR(200) | User display name                 |
| `status`              | UserStatus   | Account status                    |
| `passwordHash`        | VARCHAR(255) | Password hash                     |
| `failedLoginAttempts` | INT          | Consecutive failed login attempts |
| `lockedUntil`         | TIMESTAMP    | Temporary account lock expiration |
| `lastLoginAt`         | TIMESTAMP    | Last successful login             |
| `createdAt`           | TIMESTAMP    | Creation timestamp                |
| `updatedAt`           | TIMESTAMP    | Last update timestamp             |

### User status

```text
ACTIVE
INACTIVE
LOCKED
```

`LOCKED` represents a security state and should not be confused with a temporary `lockedUntil` value.

---

# 5. Roles

Table:

```text
roles
```

Purpose:

Defines reusable business responsibilities.

Examples:

```text
FACTORY_MANAGER
PRODUCTION_SUPERVISOR
MAINTENANCE_ENGINEER
OPERATOR
```

A role does not directly belong to a factory.

Instead, the role becomes factory-specific when assigned to a user through `user_roles`.

This allows the same role definition to be reused across multiple factories.

Example:

```text
FACTORY_MANAGER
       │
       ├── User A → Factory A
       ├── User B → Factory B
       └── User C → Factory C
```

---

# 6. Permissions

Table:

```text
permissions
```

Purpose:

Defines atomic actions that the system can authorize.

Examples:

```text
machine.read
machine.create
machine.update
maintenance.read
maintenance.create
incident.read
incident.update
```

Permissions are assigned to roles rather than directly to users.

This keeps authorization policy centralized:

```text
Role
  ↓
Permissions
```

---

# 7. Role Permissions

Table:

```text
role_permissions
```

Relationship:

```text
Role
  │
  └──< RolePermission >── Permission
```

A role can have multiple permissions.

A permission can belong to multiple roles.

Therefore:

```text
Role M ── Permission A
       ├─ Permission B
       └─ Permission C

Role N ── Permission A
       └─ Permission D
```

The table enforces:

```text
UNIQUE(roleId, permissionId)
```

to prevent duplicate role-permission assignments.

---

# 8. User Roles

Table:

```text
user_roles
```

This is the most important table for factory-scoped authorization.

It represents:

> Which role does this user have, and where does that role apply?

Main fields:

| Field       | Purpose                        |
| ----------- | ------------------------------ |
| `userId`    | Assigned user                  |
| `roleId`    | Assigned role                  |
| `scope`     | Authorization scope            |
| `factoryId` | Factory where the role applies |
| `createdAt` | Assignment creation time       |
| `revokedAt` | Assignment revocation time     |

---

# 9. Access Scope

The current schema supports:

```text
GLOBAL
FACTORY
```

### GLOBAL

```text
scope = GLOBAL
factoryId = NULL
```

The role applies globally.

Example:

```text
User
 └── SUPER_ADMIN
       └── GLOBAL
```

### FACTORY

```text
scope = FACTORY
factoryId = F001
```

The role applies only to a specific factory.

Example:

```text
User
 └── FACTORY_MANAGER
       └── FACTORY
            └── F001
```

The application layer must enforce the consistency rules:

```text
GLOBAL  → factoryId must be NULL
FACTORY → factoryId must be provided
```

These rules are intentionally handled outside the basic Prisma relation model because `factoryId` belongs to another service.

---

# 10. User Factory Access

Table:

```text
user_factory_access
```

Purpose:

Determines whether a user can access a factory context.

This is intentionally separate from `user_roles`.

The distinction is:

```text
UserFactoryAccess
    = Can the user access this factory?

UserRole
    = What role does the user have there?

RolePermission
    = What can that role do?
```

Example:

```text
User
 │
 ├── Factory A access
 │
 └── Factory B access
```

but:

```text
Factory A
 └── FACTORY_MANAGER

Factory B
 └── OPERATOR
```

This allows access and responsibility to remain separate concepts.

---

# 11. Factory Ownership

The Auth Service does not own the `Factory` entity.

Therefore:

```text
factoryId
```

is an external identifier.

There is intentionally no:

```text
FOREIGN KEY → factories.id
```

The architecture follows the database-per-service principle:

```text
Auth Service
└── Auth Database
    ├── users
    ├── roles
    ├── permissions
    └── authorization assignments


Factory Service
└── Factory Database
    └── factories
```

Cross-service database foreign keys are prohibited.

---

# 12. Assignment Lifecycle

Authorization assignments support revocation without immediately deleting historical records.

## User Role

```text
createdAt
    ↓
ACTIVE
    ↓
revokedAt
    ↓
REVOKED
```

## Factory Access

```text
createdAt
    ↓
ACTIVE
    ↓
revokedAt
    ↓
REVOKED
```

The application must treat records with:

```text
revokedAt IS NOT NULL
```

as inactive assignments.

Historical records remain available for future audit and troubleshooting.

---

# 13. Security Fields

The User entity contains account security metadata.

### Failed login attempts

```text
failedLoginAttempts
```

Tracks consecutive authentication failures.

Example:

```text
Attempt 1 → 1
Attempt 2 → 2
Attempt 3 → 3
...
```

A successful login should reset the counter according to the authentication policy.

### Account lock

```text
lockedUntil
```

Defines the expiration time of a temporary account lock.

The authentication layer decides:

```text
lockedUntil > now()
```

means the account is currently locked.

### Last login

```text
lastLoginAt
```

Stores the timestamp of the latest successful login.

---

# 14. Audit Metadata

The current schema uses lightweight lifecycle metadata:

```text
createdAt
updatedAt
revokedAt
lastLoginAt
```

These fields provide basic lifecycle tracking.

The current phase does **not** introduce a full audit log.

A future audit system may capture:

```text
actor
action
entity
entityId
timestamp
requestId
IP address
old value
new value
```

Such functionality should be designed separately rather than mixing audit events with transactional authorization tables.

---

# 15. Delete Strategy

Authorization assignments use cascading deletes for user-owned relationships:

```text
User
 ├── UserRole
 └── UserFactoryAccess
```

Deleting a user therefore removes the corresponding assignment records.

Role-permission assignments also use cascade behavior:

```text
Role
 └── RolePermission
```

and:

```text
Permission
 └── RolePermission
```

This prevents orphaned relationship records.

However, application-level authorization should normally prefer **revocation** over deletion when historical assignment information is required.

---

# 16. Indexing Strategy

Indexes are created for frequently queried authorization paths.

Important indexes include:

```text
users.status

user_roles.userId
user_roles.roleId
user_roles.factoryId
user_roles.revokedAt

user_factory_access.factoryId
user_factory_access.revokedAt

role_permissions.permissionId
```

The expected authorization lookup is approximately:

```text
User
 ↓
Factory
 ↓
Active UserRole
 ↓
Role
 ↓
RolePermission
 ↓
Permission
```

The indexes support these lookup paths without requiring full table scans as the authorization dataset grows.

---

# 17. Authorization Example

Assume:

```text
User: Huy
```

Factory access:

```text
Factory A
Factory B
```

Role assignments:

```text
Factory A → FACTORY_MANAGER
Factory B → OPERATOR
```

Permissions:

```text
FACTORY_MANAGER
 ├── machine.read
 ├── machine.update
 └── maintenance.create

OPERATOR
 └── machine.read
```

Effective authorization:

| Factory   | Role            | machine.read | machine.update | maintenance.create |
| --------- | --------------- | -----------: | -------------: | -----------------: |
| Factory A | FACTORY_MANAGER |        ALLOW |          ALLOW |              ALLOW |
| Factory B | OPERATOR        |        ALLOW |           DENY |               DENY |
| Factory C | None            |         DENY |           DENY |               DENY |

This is the intended authorization behavior.

Permissions are **not automatically inherited by every factory the user can access**.

The permission must come from a role assignment whose scope matches the requested factory.

---

# 18. Authorization Decision

A simplified authorization decision can be represented as:

```text
CanAccessFactory(user, factory)
        │
        ├── NO → DENY
        │
        └── YES
             │
             ▼
     Find active UserRole
             │
             ├── No matching role → DENY
             │
             └── Role found
                    │
                    ▼
             Find RolePermission
                    │
                    ├── Permission missing → DENY
                    │
                    └── Permission found → ALLOW
```

The actual authorization policy belongs to the application/domain layer.

The database provides the data required to evaluate that policy.

---

# 19. Prisma Source of Truth

The Prisma schema is located at:

```text
apps/auth-service/prisma/schema.prisma
```

The generated Prisma Client is located at:

```text
apps/auth-service/src/infrastructure/database/prisma/generated/
```

Generated artifacts are not the source of truth.

The source of truth is:

```text
schema.prisma
      ↓
Prisma Migration
      ↓
PostgreSQL
      ↓
Generated Prisma Client
```

---

# 20. Migration Policy

Database changes must be performed through Prisma migrations.

Development:

```bash
yarn workspace @fms/auth-service prisma migrate dev
```

Migration status:

```bash
yarn workspace @fms/auth-service prisma migrate status
```

Client generation:

```bash
yarn workspace @fms/auth-service prisma generate
```

Production migration execution will use the deployment-safe migration command defined by the service deployment process.

Migration files must be committed to Git.

Generated Prisma Client artifacts are regenerated from the schema and are not part of the database migration history.

---

# 21. Schema Design Principles

The Auth database follows these principles:

1. **Auth owns identity and authorization data.**
2. **Factory data remains owned by the Factory domain.**
3. **Cross-service foreign keys are avoided.**
4. **Roles are reusable authorization policies.**
5. **Permissions represent atomic capabilities.**
6. **User role assignments carry authorization scope.**
7. **Factory access is separated from role assignment.**
8. **Authorization assignments support revocation.**
9. **Security metadata is stored with the user account.**
10. **Database migrations are the authoritative database evolution mechanism.**
11. **Business authorization rules remain in the application layer.**
12. **The schema should not prematurely implement future capabilities.**

---

# 22. Current Schema Boundary

The current schema intentionally does not include:

```text
Sessions
Refresh Tokens
OAuth Accounts
MFA
API Keys
Audit Logs
Password History
Password Reset Tokens
Role Hierarchy
Permission Groups
```

These are separate authentication/security capabilities and should only be introduced when their corresponding requirements are defined.

The current schema establishes the foundation required for:

```text
User Identity
      +
Account Security
      +
Role-Based Access Control
      +
Factory-Scoped Authorization
```

without prematurely expanding the Auth Service data model.
