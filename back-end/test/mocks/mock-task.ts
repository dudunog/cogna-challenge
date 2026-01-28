import { Prisma } from 'generated/prisma/client';
import { TaskStatus } from 'generated/prisma/client';

export const createMockTask = (
  overrides?: Partial<Prisma.TaskGetPayload<object>>,
): Prisma.TaskGetPayload<object> => ({
  id: 'task-id',
  title: 'Test Task',
  description: 'Test Description',
  status: TaskStatus.PENDING,
  userId: 'user-id',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
  ...overrides,
});
