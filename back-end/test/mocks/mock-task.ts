import type { Task } from 'src/common/types/entities/task.type';
import { TaskStatus } from 'src/common/types/enums/task-status.enum';

export const createMockTask = (overrides?: Partial<Task>): Task => ({
  id: 'task-id',
  title: 'Test Task',
  description: 'Test Description',
  status: TaskStatus.PENDING,
  userId: 'user-id',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
  ...overrides,
});
