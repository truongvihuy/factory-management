# UCS-02. User Management

**Document Name:** Use Case Specification  
**Use Case ID:** UCS-02  
**Use Case Name:** User Management  
**Project:** Factory Management System (FMS)  
**Version:** 1.0  
**Status:** Draft  

---

# 1. Use Case Overview

## 1.1 Description

The **User Management** use case describes how the system manages user accounts throughout their lifecycle.

The system allows authorized administrators to create, update, activate, deactivate, lock, unlock, and maintain user account information.

This use case ensures that users have valid accounts before accessing the Factory Management System (FMS).

---

# 2. Actors

| Actor | Description |
| --- | --- |
| System Administrator | Manages user accounts and account status |
| User | Updates personal account information and password |
| Authentication System | Uses user account information for authentication |

---

# 3. Use Case Scope

This use case covers:

- Create user account.
- View user information.
- Update user information.
- Activate user account.
- Deactivate user account.
- Lock user account.
- Unlock user account.
- Reset user password.
- Change user password.

This use case does not cover:

- Role permission configuration.
- Factory access configuration.

Those functions are handled by:

- Authorization Management.

---

# 4. Preconditions

Before executing this use case:

1. System Administrator must have permission to manage users.
2. System must be available.
3. User information must follow required validation rules.

---

# 5. Trigger

The use case is triggered when:

- Administrator needs to manage user accounts.
- User needs to update personal account information.
- User requests password change or reset.

---

# 6. Main Success Flow

## 6.1 Create User Account

| Step | Actor Action | System Response |
| --- | --- | --- |
| 1 | Administrator opens User Management page | System displays user list |
| 2 | Administrator selects Create User | System displays user creation form |
| 3 | Administrator enters user information | System validates input data |
| 4 | Administrator submits request | System checks duplicate user information |
| 5 | System creates user account | User account is stored |
| 6 | System records user creation activity | Audit log is created |
| 7 | System displays successful creation message | User account becomes available |

---

## 6.2 Update User Information

| Step | Actor Action | System Response |
| --- | --- | --- |
| 1 | Administrator selects existing user | System displays user details |
| 2 | Administrator modifies information | System validates changes |
| 3 | Administrator submits update | System updates user information |
| 4 | System records modification activity | Audit log is created |

---

## 6.3 Activate User Account

| Step | Actor Action | System Response |
| --- | --- | --- |
| 1 | Administrator selects inactive user | System displays account status |
| 2 | Administrator activates account | System updates status to Active |
| 3 | System saves change | User can authenticate |

---

## 6.4 Deactivate User Account

| Step | Actor Action | System Response |
| --- | --- | --- |
| 1 | Administrator selects active user | System displays account information |
| 2 | Administrator disables account | System changes status to Disabled |
| 3 | System saves change | User cannot authenticate |

---

## 6.5 Reset Password

| Step | Actor Action | System Response |
| --- | --- | --- |
| 1 | Administrator selects user account | System displays account information |
| 2 | Administrator requests password reset | System generates reset process |
| 3 | System updates password information | User can login using new password |

---

# 7. Alternative Flows

## AF-01 Duplicate Username

### Condition

Username already exists in the system.

Flow:

| Step | Actor Action | System Response |
| --- | --- | --- |
| 1 | Administrator enters username | System checks existing accounts |
| 2 | Duplicate username detected | System rejects request |
| 3 | System displays duplicate warning | Administrator enters another username |

Result:

- User account is not created.

---

## AF-02 Duplicate Email

### Condition

Email address already exists.

Flow:

| Step | Actor Action | System Response |
| --- | --- | --- |
| 1 | Administrator submits user information | System validates email |
| 2 | Existing email found | System rejects request |
| 3 | System displays validation error | Administrator updates information |

---

## AF-03 Invalid User Information

### Condition

Required user information is missing or invalid.

Flow:

| Step | Actor Action | System Response |
| --- | --- | --- |
| 1 | Administrator submits form | System validates data |
| 2 | Validation fails | System displays validation errors |
| 3 | Administrator corrects information | Request can be submitted again |

---

# 8. Exception Flows

## EF-01 Database Failure

### Condition

System cannot save user information.

Flow:

| Step | Actor Action | System Response |
| --- | --- | --- |
| 1 | Administrator submits request | System processes request |
| 2 | Database error occurs | System rolls back transaction |
| 3 | System records error log | User receives failure notification |

---

## EF-02 Unauthorized Access

### Condition

User without permission attempts user management.

Flow:

| Step | Actor Action | System Response |
| --- | --- | --- |
| 1 | User accesses User Management | System checks permission |
| 2 | Permission denied | System rejects access |
| 3 | System records security event | User cannot continue |

---

# 9. Business Rules

## BR-USER-001 Unique User Account

Each user account must have:

- Unique Username.
- Unique identifier.

---

## BR-USER-002 Account Status Management

User account can have the following statuses:

```text
Active
Disabled
Locked
````

---

## BR-USER-003 Disabled Account

Disabled users:

* Cannot authenticate.
* Cannot access system functions.

---

## BR-USER-004 User Deletion Policy

User accounts shall not be permanently deleted if historical activities exist.

The system shall:

* Disable account instead.
* Preserve audit history.

---

## BR-USER-005 Password Security

The system shall:

* Store passwords securely.
* Never display original passwords.
* Require password validation during change/reset.

---

## BR-USER-006 Audit Requirement

The system shall record:

* User creation.
* User update.
* Password reset.
* Account activation.
* Account deactivation.
* Account locking.

---

# 10. Data Requirements

## User Entity

| Field           | Description            |
| --------------- | ---------------------- |
| User ID         | Unique identifier      |
| Username        | Login name             |
| Full Name       | User display name      |
| Email           | User email             |
| Phone Number    | Contact information    |
| Password        | Encrypted password     |
| Status          | Account status         |
| Created Date    | Account creation date  |
| Updated Date    | Last modification date |
| Last Login Time | Latest login timestamp |

---

# 11. Input Requirements

## Create / Update User

| Field        | Required          |
| ------------ | ----------------- |
| Username     | Yes               |
| Full Name    | Yes               |
| Email        | Yes               |
| Phone Number | No                |
| Password     | Yes (Create only) |
| Status       | Yes               |

---

# 12. Output Requirements

The system provides:

* User list.
* User details.
* Account status.
* Operation result message.
* Audit information.

---

# 13. Postconditions

## Successful Execution

After completion:

* User account is created or updated.
* Account status is changed if requested.
* Audit record is generated.

---

## Failed Execution

After failure:

* No invalid data is stored.
* Error information is returned.
* Failure is logged.

---

# 14. Acceptance Criteria

## AC-01 Create User

Given:

* Administrator has user management permission.

When:

* Administrator enters valid user information.

Then:

* System creates a new user account.
* User can authenticate.

---

## AC-02 Update User

Given:

* User account exists.

When:

* Administrator updates user information.

Then:

* System saves updated information.
* Change is recorded.

---

## AC-03 Disable User

Given:

* User account is active.

When:

* Administrator disables the account.

Then:

* User cannot login.

---

## AC-04 Reset Password

Given:

* User account exists.

When:

* Administrator resets password.

Then:

* User can authenticate using new credentials.

---

## AC-05 Audit Logging

Given:

* Administrator performs user management action.

When:

* Action completes.

Then:

* System creates audit record.

---

# 15. Related Requirements

| Requirement     | Reference             |
| --------------- | --------------------- |
| User Management | FR-08                 |
| Authorization   | FR-09                 |
| Authentication  | UCS-01                |
| Audit Log       | FR-12                 |
| Security Rules  | SRS-07 Business Rules |

---

# Revision History

| Version | Date       | Author           | Description     |
| ------- | ---------- | ---------------- | --------------- |
| 1.0     | 2026-08-07 | Business Analyst | Initial version |

