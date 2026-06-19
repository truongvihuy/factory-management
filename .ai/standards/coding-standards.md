# Coding Standards

## Required

- strict mode enabled
- no any
- use DTO
- use dependency injection
- use interfaces

## Forbidden

- business logic inside controller
- prisma query inside controller
- hardcoded config

## Exception Handling

Always throw:

BusinessException

Never throw generic Error.