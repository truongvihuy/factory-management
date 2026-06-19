# Prisma Guidelines

All database access goes through PrismaService.

Do not instantiate PrismaClient manually.

Use transactions when updating multiple tables.

Prefer select over include.

Use pagination for list endpoints.

Soft delete preferred over hard delete.