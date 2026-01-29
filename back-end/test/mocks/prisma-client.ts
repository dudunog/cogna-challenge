/**
 * Jest-safe mock for `generated/prisma/client`.
 *
 * Used via Jest `moduleNameMapper` so tests never load the real Prisma client
 * (which uses ESM/import.meta and fails under Jest's CommonJS environment).
 *
 * Best practices applied (javascript-testing-patterns):
 * - Mock external dependencies to keep tests isolated and fast.
 * - Provide only the runtime shape needed; types are satisfied by the real
 *   client at compile time when not running Jest.
 * - Tests that need a database-like client should mock DatabaseService
 *   (dependency injection) rather than extending this stub.
 */

// -----------------------------------------------------------------------------
// PrismaClient – stub for DatabaseService (extends PrismaClient)
// -----------------------------------------------------------------------------

export class PrismaClient {
  constructor(..._args: unknown[]) {}

  async $connect(): Promise<void> {}

  async $disconnect(): Promise<void> {}
}

// -----------------------------------------------------------------------------
// Prisma namespace – runtime placeholder for type-only usage
// -----------------------------------------------------------------------------

/**
 * Empty namespace stub. Types (TaskWhereInput, TaskGetPayload, etc.) are
 * provided by the real generated client at compile time; at Jest runtime
 * only this object is used.
 */
export const Prisma: Record<string, unknown> = {};

// -----------------------------------------------------------------------------
// TaskStatus enum – used at runtime in DTOs and test fixtures
// -----------------------------------------------------------------------------

export enum TaskStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}
