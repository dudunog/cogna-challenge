import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { DatabaseService } from '../database/database.service';
import { Prisma } from 'generated/prisma/client';

describe('UserService', () => {
  let service: UserService;
  let mockDatabaseService: {
    user: {
      findUnique: jest.Mock;
      findMany: jest.Mock;
      count: jest.Mock;
      create: jest.Mock;
      update: jest.Mock;
      delete: jest.Mock;
    };
  };

  const createMockUser = (
    overrides?: Partial<Prisma.UserGetPayload<object>>,
  ) => ({
    id: 'test-id',
    email: 'test@example.com',
    password: 'hashed-password',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    ...overrides,
  });

  const createMockUserWithTasks = () => ({
    ...createMockUser(),
    tasks: [],
  });

  beforeEach(async () => {
    mockDatabaseService = {
      user: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
        count: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: DatabaseService,
          useValue: mockDatabaseService,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findUnique', () => {
    const mockWhere = { id: 'test-id' };

    describe('when user exists', () => {
      it('should return user with included relations', async () => {
        // Arrange
        const include = { tasks: true };
        const expectedUser = createMockUserWithTasks();
        mockDatabaseService.user.findUnique.mockResolvedValue(expectedUser);

        // Act
        const result = await service.findUnique({ where: mockWhere, include });

        // Assert
        expect(mockDatabaseService.user.findUnique).toHaveBeenCalledTimes(1);
        expect(mockDatabaseService.user.findUnique).toHaveBeenCalledWith({
          where: mockWhere,
          include,
        });
        expect(result).toEqual(expectedUser);
        expect(result).toHaveProperty('tasks');
      });
    });

    describe('when user does not exist', () => {
      it('should return null', async () => {
        // Arrange
        const where = { id: 'non-existent-id' };
        mockDatabaseService.user.findUnique.mockResolvedValue(null);

        // Act
        const result = await service.findUnique({ where });

        // Assert
        expect(result).toBeNull();
        expect(mockDatabaseService.user.findUnique).toHaveBeenCalledWith({
          where,
          select: undefined,
        });
      });
    });

    describe('error handling', () => {
      it('should propagate database errors', async () => {
        // Arrange
        const error = new Error('Database connection failed');
        mockDatabaseService.user.findUnique.mockRejectedValue(error);

        // Act & Assert
        await expect(service.findUnique({ where: mockWhere })).rejects.toThrow(
          'Database connection failed',
        );
        expect(mockDatabaseService.user.findUnique).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('findMany', () => {
    describe('when users exist', () => {
      it('should return array of users', async () => {
        // Arrange
        const params = {
          skip: 0,
          take: 10,
          where: { email: 'test@example.com' },
          orderBy: { createdAt: 'desc' as const },
          include: { tasks: true },
        };
        const expectedUsers = [createMockUserWithTasks()];
        mockDatabaseService.user.findMany.mockResolvedValue(expectedUsers);

        // Act
        const result = await service.findMany(params);

        // Assert
        expect(mockDatabaseService.user.findMany).toHaveBeenCalledTimes(1);
        expect(mockDatabaseService.user.findMany).toHaveBeenCalledWith(params);
        expect(result).toEqual(expectedUsers);
        expect(result).toHaveLength(1);
      });
    });

    describe('when no users match', () => {
      it('should return empty array', async () => {
        // Arrange
        mockDatabaseService.user.findMany.mockResolvedValue([]);

        // Act
        const result = await service.findMany({});

        // Assert
        expect(result).toEqual([]);
        expect(result).toHaveLength(0);
        expect(mockDatabaseService.user.findMany).toHaveBeenCalledWith({});
      });
    });

    describe('error handling', () => {
      it('should propagate database errors', async () => {
        // Arrange
        const error = new Error('Database connection failed');
        mockDatabaseService.user.findMany.mockRejectedValue(error);

        // Act & Assert
        await expect(service.findMany({})).rejects.toThrow(
          'Database connection failed',
        );
        expect(mockDatabaseService.user.findMany).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('count', () => {
    describe('when users match criteria', () => {
      it('should return count', async () => {
        // Arrange
        const where = { email: 'test@example.com' };
        const expectedCount = 5;
        mockDatabaseService.user.count.mockResolvedValue(expectedCount);

        // Act
        const result = await service.count({ where });

        // Assert
        expect(mockDatabaseService.user.count).toHaveBeenCalledTimes(1);
        expect(mockDatabaseService.user.count).toHaveBeenCalledWith({ where });
        expect(result).toBe(expectedCount);
        expect(typeof result).toBe('number');
      });
    });

    describe('when no users match', () => {
      it('should return zero', async () => {
        // Arrange
        const where = { email: 'non-existent@example.com' };
        mockDatabaseService.user.count.mockResolvedValue(0);

        // Act
        const result = await service.count({ where });

        // Assert
        expect(result).toBe(0);
        expect(mockDatabaseService.user.count).toHaveBeenCalledWith({ where });
      });
    });

    describe('error handling', () => {
      it('should propagate database errors', async () => {
        // Arrange
        const error = new Error('Database connection failed');
        mockDatabaseService.user.count.mockRejectedValue(error);

        // Act & Assert
        await expect(service.count({})).rejects.toThrow(
          'Database connection failed',
        );
        expect(mockDatabaseService.user.count).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('create', () => {
    const mockUserData = {
      email: 'test@example.com',
      password: 'hashed-password',
    };

    describe('successful creation', () => {
      it('should create user with included relations', async () => {
        // Arrange
        const include = { tasks: true };
        const expectedUser = {
          ...createMockUser({ id: 'new-id' }),
          tasks: [],
        };
        mockDatabaseService.user.create.mockResolvedValue(expectedUser);

        // Act
        const result = await service.create({ data: mockUserData, include });

        // Assert
        expect(mockDatabaseService.user.create).toHaveBeenCalledTimes(1);
        expect(mockDatabaseService.user.create).toHaveBeenCalledWith({
          data: mockUserData,
          include,
        });
        expect(result).toEqual(expectedUser);
        expect(result).toHaveProperty('tasks');
        expect(result.id).toBe('new-id');
      });
    });

    describe('error handling', () => {
      it('should propagate unique constraint violation errors', async () => {
        // Arrange
        const error = new Error('Unique constraint violation');
        mockDatabaseService.user.create.mockRejectedValue(error);

        // Act & Assert
        await expect(service.create({ data: mockUserData })).rejects.toThrow(
          'Unique constraint violation',
        );
        expect(mockDatabaseService.user.create).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('update', () => {
    const mockWhere = { id: 'test-id' };
    const mockUpdateData = { email: 'updated@example.com' };

    describe('successful update', () => {
      it('should update user with included relations', async () => {
        // Arrange
        const include = { tasks: true };
        const expectedUser = {
          ...createMockUser(mockWhere),
          ...mockUpdateData,
          tasks: [],
        };
        mockDatabaseService.user.update.mockResolvedValue(expectedUser);

        // Act
        const result = await service.update({
          where: mockWhere,
          data: mockUpdateData,
          include,
        });

        // Assert
        expect(mockDatabaseService.user.update).toHaveBeenCalledTimes(1);
        expect(mockDatabaseService.user.update).toHaveBeenCalledWith({
          where: mockWhere,
          data: mockUpdateData,
          include,
        });
        expect(result).toEqual(expectedUser);
        expect(result.email).toBe('updated@example.com');
        expect(result).toHaveProperty('tasks');
      });
    });

    describe('error handling', () => {
      it('should propagate error when user not found', async () => {
        // Arrange
        const where = { id: 'non-existent-id' };
        const error = new Error('Record to update does not exist');
        mockDatabaseService.user.update.mockRejectedValue(error);

        // Act & Assert
        await expect(
          service.update({ where, data: mockUpdateData }),
        ).rejects.toThrow('Record to update does not exist');
        expect(mockDatabaseService.user.update).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('delete', () => {
    const mockWhere = { id: 'test-id' };

    describe('successful deletion', () => {
      it('should delete user and return deleted user data', async () => {
        // Arrange
        const expectedDeletedUser = createMockUser();
        mockDatabaseService.user.delete.mockResolvedValue(expectedDeletedUser);

        // Act
        const result = await service.delete({ where: mockWhere });

        // Assert
        expect(mockDatabaseService.user.delete).toHaveBeenCalledTimes(1);
        expect(mockDatabaseService.user.delete).toHaveBeenCalledWith({
          where: mockWhere,
        });
        expect(result).toEqual(expectedDeletedUser);
        expect(result.id).toBe('test-id');
      });
    });

    describe('error handling', () => {
      it('should propagate error when user not found', async () => {
        // Arrange
        const where = { id: 'non-existent-id' };
        const error = new Error('Record to delete does not exist');
        mockDatabaseService.user.delete.mockRejectedValue(error);

        // Act & Assert
        await expect(service.delete({ where })).rejects.toThrow(
          'Record to delete does not exist',
        );
        expect(mockDatabaseService.user.delete).toHaveBeenCalledTimes(1);
      });
    });
  });
});
