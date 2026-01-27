import { Prisma } from 'generated/prisma/client';

export const createMockUser = (
  overrides?: Partial<Prisma.UserGetPayload<object>>,
): Prisma.UserGetPayload<object> => ({
  id: 'user-id',
  email: 'test@example.com',
  name: 'Test User',
  password: 'hashed-password',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
  ...overrides,
});
