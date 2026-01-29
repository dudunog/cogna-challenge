import type { User } from 'src/common/types/entities/user.type';

export const createMockUser = (overrides?: Partial<User>): User => ({
  id: 'user-id',
  email: 'test@example.com',
  name: 'Test User',
  password: 'hashed-password',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
  ...overrides,
});
