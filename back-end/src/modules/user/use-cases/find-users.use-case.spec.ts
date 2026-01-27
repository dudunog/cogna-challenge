import { Test, TestingModule } from '@nestjs/testing';
import { FindUsersUseCase } from './find-users.use-case';
import { UserService } from 'src/modules/user/user.service';
import { QueryUserDto } from 'src/modules/user/dto/query-user.dto';
import { Prisma } from 'generated/prisma/client';

describe('FindUsersUseCase', () => {
  let useCase: FindUsersUseCase;
  let mockUserService: {
    findMany: jest.Mock;
    count: jest.Mock;
  };

  const createMockUser = (
    overrides?: Partial<Prisma.UserGetPayload<object>>,
  ) => ({
    id: 'user-id',
    email: 'test@example.com',
    password: 'hashed-password',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    ...overrides,
  });

  beforeEach(async () => {
    mockUserService = {
      findMany: jest.fn(),
      count: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindUsersUseCase,
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    useCase = module.get<FindUsersUseCase>(FindUsersUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    describe('when users exist', () => {
      it('should return users with metadata when all query parameters provided', async () => {
        // Arrange
        const query: QueryUserDto = {
          skip: 0,
          take: 10,
          email: 'test',
          orderBy: 'desc',
        };
        const expectedUsers = [createMockUser()];
        const expectedTotal = 1;
        mockUserService.findMany.mockResolvedValue(expectedUsers);
        mockUserService.count.mockResolvedValue(expectedTotal);

        // Act
        const result = await useCase.execute(query);

        // Assert
        expect(mockUserService.findMany).toHaveBeenCalledTimes(1);
        expect(mockUserService.findMany).toHaveBeenCalledWith({
          skip: query.skip,
          take: query.take,
          where: { email: { contains: query.email } },
          orderBy: { createdAt: 'desc' },
        });
        expect(mockUserService.count).toHaveBeenCalledTimes(1);
        expect(mockUserService.count).toHaveBeenCalledWith({
          where: { email: { contains: query.email } },
        });
        expect(result).toEqual({
          data: expectedUsers,
          meta: {
            total: expectedTotal,
            skip: query.skip,
            take: query.take,
          },
        });
      });

      it('should return users with default ordering when orderBy not provided', async () => {
        // Arrange
        const query: QueryUserDto = {
          skip: 0,
          take: 10,
        };
        const expectedUsers = [createMockUser()];
        const expectedTotal = 1;
        mockUserService.findMany.mockResolvedValue(expectedUsers);
        mockUserService.count.mockResolvedValue(expectedTotal);

        // Act
        const result = await useCase.execute(query);

        // Assert
        expect(mockUserService.findMany).toHaveBeenCalledWith({
          skip: query.skip,
          take: query.take,
          where: {},
          orderBy: { createdAt: 'desc' },
        });
        expect(result.meta).toEqual({
          total: expectedTotal,
          skip: query.skip,
          take: query.take,
        });
      });

      it('should filter by email when email query parameter provided', async () => {
        // Arrange
        const query: QueryUserDto = {
          email: 'test@example.com',
        };
        const expectedUsers = [createMockUser()];
        const expectedTotal = 1;
        mockUserService.findMany.mockResolvedValue(expectedUsers);
        mockUserService.count.mockResolvedValue(expectedTotal);

        // Act
        await useCase.execute(query);

        // Assert
        expect(mockUserService.findMany).toHaveBeenCalledWith({
          skip: undefined,
          take: undefined,
          where: { email: { contains: query.email } },
          orderBy: { createdAt: 'desc' },
        });
      });
    });

    describe('when no users match', () => {
      it('should return empty array with zero total', async () => {
        // Arrange
        const query: QueryUserDto = {};
        mockUserService.findMany.mockResolvedValue([]);
        mockUserService.count.mockResolvedValue(0);

        // Act
        const result = await useCase.execute(query);

        // Assert
        expect(result.data).toEqual([]);
        expect(result.meta.total).toBe(0);
        expect(result.meta.skip).toBe(0);
        expect(result.meta.take).toBe(0);
      });
    });

    describe('error handling', () => {
      it('should propagate database errors from findMany', async () => {
        // Arrange
        const query: QueryUserDto = {};
        const error = new Error('Database connection failed');
        mockUserService.findMany.mockRejectedValue(error);
        mockUserService.count.mockResolvedValue(0);

        // Act & Assert
        await expect(useCase.execute(query)).rejects.toThrow(
          'Database connection failed',
        );
      });
    });
  });
});
