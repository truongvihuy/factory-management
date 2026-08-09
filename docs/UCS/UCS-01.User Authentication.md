# UCS-01. User Authentication

**Document Name:** Use Case Specification  
**Use Case ID:** UCS-01  
**Use Case Name:** User Authentication  
**Project:** Factory Management System (FMS)  
**Version:** 1.0  
**Status:** Draft

---

# 1. Use Case Overview

## 1.1 Description

The **User Authentication** use case describes how users authenticate themselves to access the Factory Management System (FMS).

The system verifies user credentials, validates account status, establishes user sessions, and provides access based on assigned roles and factory permissions.

This use case ensures that only authorized users can access system functions and operational data.

---

# 2. Actors

| Actor                 | Description                                                     |
| --------------------- | --------------------------------------------------------------- |
| User                  | A person who accesses the Factory Management System             |
| System Administrator  | Responsible for managing user accounts and access permissions   |
| Authentication System | Internal system component responsible for credential validation |

---

# 3. Use Case Scope

This use case covers:

- User login.
- Credential validation.
- Account status validation.
- Session creation.
- Authentication failure handling.
- User logout.

This use case does not cover:

- User creation.
- User role assignment.
- Permission configuration.

Those functions are handled by:

- UCS-02 User Management.
- Authorization Management.

---

# 4. Preconditions

Before executing this use case:

1. User account must already exist in the system.
2. User account must be active.
3. User must have valid login credentials.
4. System authentication service must be available.

---

# 5. Trigger

The use case is triggered when:

- User accesses the FMS login page.
- User submits authentication credentials.

---

# 6. Main Success Flow

| Step | Actor Action                                               | System Response                              |
| ---- | ---------------------------------------------------------- | -------------------------------------------- |
| 1    | User opens the login page                                  | System displays login form                   |
| 2    | User enters username and password                          | System receives authentication request       |
| 3    | User submits login request                                 | System validates input format                |
| 4    | System verifies user credentials                           | System checks username and password validity |
| 5    | System checks user account status                          | System verifies account is active            |
| 6    | System retrieves user roles and factory access permissions | System loads authorization information       |
| 7    | System creates user session                                | User is authenticated successfully           |
| 8    | System redirects user to dashboard                         | User can access permitted functions          |

---

# 7. Alternative Flows

## AF-01 Invalid Credentials

### Condition

User enters incorrect username or password.

### Flow

| Step | Actor Action                  | System Response               |
| ---- | ----------------------------- | ----------------------------- |
| 1    | User submits login request    | System validates credentials  |
| 2    | Credentials are invalid       | System rejects authentication |
| 3    | System displays error message | User is requested to retry    |

Result:

- User remains unauthenticated.

---

## AF-02 Disabled Account

### Condition

User account exists but is disabled.

### Flow

| Step | Actor Action                             | System Response            |
| ---- | ---------------------------------------- | -------------------------- |
| 1    | User submits credentials                 | System validates account   |
| 2    | System detects disabled account          | Authentication is rejected |
| 3    | System displays account disabled message | User cannot access system  |

Result:

- Access is denied.

---

## AF-03 Locked Account

### Condition

User account is locked due to security policy.

### Flow

| Step | Actor Action                                 | System Response              |
| ---- | -------------------------------------------- | ---------------------------- |
| 1    | User submits credentials                     | System checks account status |
| 2    | System detects locked account                | Authentication is rejected   |
| 3    | System informs user to contact administrator | Access is denied             |

---

# 8. Exception Flows

## EF-01 Authentication Service Unavailable

### Condition

Authentication service is unavailable.

Flow:

| Step | Actor Action                       | System Response                             |
| ---- | ---------------------------------- | ------------------------------------------- |
| 1    | User submits login request         | System attempts authentication              |
| 2    | Authentication service fails       | System returns service unavailable response |
| 3    | System displays error notification | User retries later                          |

---

## EF-02 System Error During Login

### Condition

Unexpected system error occurs.

Flow:

| Step | Actor Action                          | System Response          |
| ---- | ------------------------------------- | ------------------------ |
| 1    | User submits credentials              | System processes request |
| 2    | Internal error occurs                 | System logs error        |
| 3    | System displays generic error message | User cannot login        |

---

# 9. Business Rules

## BR-AUTH-001 Local Account Authentication

The MVP supports:

- Local Account authentication only.

External authentication providers are not supported.

---

## BR-AUTH-002 Active Account Requirement

Only active user accounts can authenticate successfully.

---

## BR-AUTH-003 Authorization Dependency

After successful authentication:

The system shall load:

- User role.
- Factory access permission.
- Available system functions.

---

## BR-AUTH-004 Factory-Level Access Control

Users can only access data belonging to factories assigned to their account.

Example:

```

User A

Allowed:
Factory 01
Factory 02

Denied:
Factory 03

```

---

## BR-AUTH-005 Failed Login Handling

The system shall track failed authentication attempts.

After exceeding the configured limit:

- Account may be temporarily locked.
- Administrator intervention may be required.

---

# 10. Data Requirements

## User Authentication Data

| Field              | Description                |
| ------------------ | -------------------------- |
| User ID            | Unique user identifier     |
| Username           | Login username             |
| Password           | Encrypted password         |
| Account Status     | Active / Disabled / Locked |
| Role               | User permission role       |
| Factory Access     | Assigned factories         |
| Last Login Time    | Latest successful login    |
| Failed Login Count | Number of failed attempts  |

---

# 11. Input Requirements

The system receives:

| Input    | Required |
| -------- | -------- |
| Username | Yes      |
| Password | Yes      |

---

# 12. Output Requirements

Successful authentication returns:

- Authentication status.
- User identity.
- User role.
- Factory permissions.
- Session information.

Failed authentication returns:

- Authentication failure message.

---

# 13. Postconditions

## Successful Authentication

After successful execution:

- User session is created.
- User can access authorized functions.
- User activity can be recorded in audit logs.

---

## Failed Authentication

After unsuccessful execution:

- User remains unauthenticated.
- Authentication failure is recorded.

---

# 14. Acceptance Criteria

## AC-01 Successful Login

Given:

- User has a valid active account.

When:

- User enters correct username and password.

Then:

- System authenticates the user.
- User is redirected to the dashboard.
- User permissions are loaded.

---

## AC-02 Invalid Credential Handling

Given:

- User enters incorrect credentials.

When:

- Login request is submitted.

Then:

- System rejects authentication.
- Error message is displayed.

---

## AC-03 Disabled Account Handling

Given:

- User account is disabled.

When:

- User attempts login.

Then:

- System denies access.

---

## AC-04 Factory Access Control

Given:

- User has access to Factory A only.

When:

- User logs in.

Then:

- User can access Factory A data.
- User cannot access other factory data.

---

## AC-05 Audit Recording

Given:

- User successfully logs in.

When:

- Authentication completes.

Then:

- Login activity is recorded in audit logs.

---

# 15. Related Requirements

| Requirement     | Reference             |
| --------------- | --------------------- |
| User Management | FR-08                 |
| Authorization   | FR-09                 |
| Audit Log       | FR-12                 |
| Security Rules  | SRS-07 Business Rules |

---

# Revision History

| Version | Date       | Author           | Description     |
| ------- | ---------- | ---------------- | --------------- |
| 1.0     | 2026-08-07 | Business Analyst | Initial version |
