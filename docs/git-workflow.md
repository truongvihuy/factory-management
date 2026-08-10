# Git Workflow

This document defines the Git workflow, branch naming, commit conventions, and Pull Request standards for the Factory Management System.

The goal is to maintain a clean, traceable, and reviewable Git history.

---

## 1. Branch Strategy

The project uses `main` as the primary stable branch.

Developers work through short-lived feature branches.

```text
main
 │
 ├── feature/auth-login
 │
 ├── feature/session-management
 │
 ├── fix/config-validation
 │
 └── refactor/logger
```

Direct development on `main` is not allowed.

---

## 2. Branch Naming

Branch names must use one of the following prefixes:

```text
feature/*
fix/*
refactor/*
test/*
docs/*
chore/*
perf/*
build/*
ci/*
```

### Examples

```text
feature/auth-login
feature/auth-session
feature/factory-machine
fix/auth-expired-token
fix/config-validation
refactor/logger
test/auth-service
docs/architecture
chore/docker-setup
perf/telemetry-ingestion
```

Branch names should describe the purpose of the work.

---

## 3. Invalid Branch Names

Avoid vague names:

```text
test
new
update
fix
temp
abc
huy
final
final-v2
```

A branch name should provide enough context to understand the work without opening the branch.

---

## 4. Creating a Branch

Always start from an updated `main` branch:

```bash
git checkout main
git pull
```

Create a new branch:

```bash
git checkout -b feature/auth-login
```

Or:

```bash
git switch main
git pull
git switch -c feature/auth-login
```

---

## 5. Conventional Commits

Commit messages follow the Conventional Commits format:

```text
<type>(<scope>): <description>
```

Example:

```text
feat(auth): add login endpoint
```

---

## 6. Commit Types

The following commit types are supported:

| Type       | Purpose                                    |
| ---------- | ------------------------------------------ |
| `feat`     | New functionality                          |
| `fix`      | Bug fix                                    |
| `refactor` | Code restructuring without behavior change |
| `test`     | Add or modify tests                        |
| `docs`     | Documentation changes                      |
| `chore`    | Maintenance work                           |
| `perf`     | Performance improvement                    |
| `build`    | Build/tooling changes                      |
| `ci`       | CI/CD changes                              |

---

## 7. Commit Scope

The scope should identify the affected service or technical area.

Current service scopes include:

```text
gateway
auth
factory
telemetry
alert
maintenance
incident
reporting
audit
```

Technical scopes may include:

```text
config
docker
common
logger
test
```

Examples:

```text
feat(auth): add login endpoint
fix(auth): reject expired refresh token
feat(telemetry): add telemetry ingestion
fix(config): validate redis url
refactor(logger): simplify error context
chore(docker): update postgres image
test(auth): add credential validation tests
```

---

## 8. Commit Description

Commit descriptions should:

- Be concise.
- Use lowercase.
- Describe the change.
- Use imperative wording.
- Not end with a period.

Good:

```text
feat(auth): add refresh token rotation
```

Bad:

```text
Added refresh token rotation.
```

Bad:

```text
update
```

---

## 9. Atomic Commits

Each commit should represent one logical change.

Avoid mixing unrelated changes.

### Bad

```text
feat(auth): update authentication

- add login
- fix logger
- change Docker
- update ESLint
- modify README
```

### Good

```text
feat(auth): add login endpoint
fix(logger): handle optional context
chore(docker): update development image
docs(auth): document authentication flow
```

Atomic commits make the history easier to:

- Review
- Revert
- Cherry-pick
- Debug
- Bisect

---

## 10. Commit Before Push

Before pushing changes, verify the workspace.

```bash
yarn typecheck
yarn lint
yarn test
```

Then inspect:

```bash
git status
```

Review the changes:

```bash
git diff
```

Stage only the intended files:

```bash
git add <files>
```

Create the commit:

```bash
git commit -m "feat(auth): add login endpoint"
```

Push:

```bash
git push -u origin feature/auth-login
```

---

## 11. Pull Request Workflow

The standard workflow is:

```text
main
 │
 ▼
Create Branch
 │
 ▼
Implement
 │
 ▼
Typecheck
 │
 ▼
Lint
 │
 ▼
Test
 │
 ▼
Commit
 │
 ▼
Push
 │
 ▼
Pull Request
 │
 ▼
Code Review
 │
 ▼
Quality Gate
 │
 ▼
Merge
```

Pull Requests should contain focused changes.

Avoid large unrelated changes in the same PR.

---

## 12. Pull Request Checklist

Before opening a Pull Request:

```text
[ ] Code is focused on one purpose
[ ] Typecheck passes
[ ] Lint passes
[ ] Tests pass
[ ] New business logic has appropriate tests
[ ] No secrets are committed
[ ] No unnecessary dependencies were added
[ ] No direct process.env access outside configuration
[ ] Documentation updated where necessary
[ ] Commit messages follow Conventional Commits
```

---

## 13. Main Branch Rules

`main` represents the stable integration branch.

The following are not allowed:

```text
git push origin main
```

for normal development work.

Changes should go through Pull Requests.

The exact branch protection rules may be enforced by the repository hosting platform and CI pipeline.

---

## 14. Commit History

The Git history should communicate the evolution of the system.

A good history might look like:

```text
feat(auth): add authentication module
feat(auth): add user repository
feat(auth): add password hashing
feat(auth): add login endpoint
test(auth): add authentication tests
docs(auth): document authentication flow
```

A poor history might look like:

```text
update
fix
fix2
changes
test
final
final2
done
```

The Git history is part of the engineering documentation.

---

## 15. Rewriting Local Commits

Before pushing a branch, local commits may be cleaned up when necessary.

For example:

```bash
git rebase -i HEAD~3
```

This can be used to:

- Squash unnecessary commits.
- Fix commit messages.
- Reorder local commits.

Do not rewrite shared history without agreement from collaborators.

---

## 16. Secrets and Sensitive Files

Never commit:

```text
.env
.env.*
private keys
credentials
API keys
database dumps
production configuration
```

The repository should contain:

```text
.env.example
```

instead of real secrets.

Verify before committing:

```bash
git status
git diff --cached
```

---

## 17. Git Ignore

The repository uses a root-level `.gitignore`.

Examples of ignored files:

```text
node_modules/
dist/
coverage/
.env
*.log
```

Service-level `.gitignore` files should not be created unless a service has a specific requirement that cannot be handled by the root `.gitignore`.

The goal is to keep repository-wide ignore rules centralized.

---

## 18. Git Attributes

The repository uses `.gitattributes` to normalize line endings.

```text
* text=auto eol=lf
```

This prevents unnecessary line-ending changes between:

- Windows
- WSL
- Linux
- CI environments

---

## 19. Useful Git Commands

### Check status

```bash
git status
```

### View changes

```bash
git diff
```

### View staged changes

```bash
git diff --cached
```

### View history

```bash
git log --oneline --decorate --graph
```

### Create branch

```bash
git switch -c feature/example
```

### Update main

```bash
git switch main
git pull
```

### Push branch

```bash
git push -u origin feature/example
```

---

## 20. Git Workflow Example

Example implementation of a new authentication feature:

```bash
git switch main
git pull

git switch -c feature/auth-login

# Implement changes

yarn typecheck
yarn lint
yarn test

git status
git diff

git add apps/auth-service

git commit -m "feat(auth): add login endpoint"

git push -u origin feature/auth-login
```

Then create a Pull Request targeting `main`.

---

## 21. Git Principles

The project follows these principles:

1. `main` remains stable.
2. Development happens on short-lived branches.
3. Branch names describe the work.
4. Commits follow Conventional Commits.
5. Commits are atomic.
6. Pull Requests contain focused changes.
7. Code is verified before pushing.
8. Secrets are never committed.
9. Git history should remain understandable.
10. Repository-wide Git rules are centralized.

---

## 22. Standard Workflow

```text
Create Branch
      │
      ▼
Implement
      │
      ▼
Verify
 ┌────┼────┐
 ▼    ▼    ▼
Type  Lint Test
 └────┼────┘
      ▼
Commit
      │
      ▼
Push
      │
      ▼
Pull Request
      │
      ▼
Review
      │
      ▼
Quality Gate
      │
      ▼
Merge → main
```
