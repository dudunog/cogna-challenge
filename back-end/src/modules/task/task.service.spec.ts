import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from './task.service';
import { DatabaseService } from 'src/modules/database/database.service';
import { createMockTask } from 'test/mocks/mock-task';

describe('TaskService', () => {
  let service: TaskService;
  let mockDatabaseService: {
    task: {
      findUnique: jest.Mock;
      findMany: jest.Mock;
      count: jest.Mock;
      create: jest.Mock;
      update: jest.Mock;
      delete: jest.Mock;
    };
  };

  beforeEach(async () => {
    mockDatabaseService = {
      task: {
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
        TaskService,
        {
          provide: DatabaseService,
          useValue: mockDatabaseService,
        },
      ],
    }).compile();

    service = module.get<TaskService>(TaskService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findUnique', () => {
    const mockWhere = { id: 'test-id' };

    describe('when task exists', () => {
      it('should return task with included relations', async () => {
        // Arrange
        const include = { user: true };
        const expectedTask = createMockTask();
        mockDatabaseService.task.findUnique.mockResolvedValue(expectedTask);

        // Act
        const result = await service.findUnique({ where: mockWhere, include });

        // Assert
        expect(mockDatabaseService.task.findUnique).toHaveBeenCalledTimes(1);
        expect(mockDatabaseService.task.findUnique).toHaveBeenCalledWith({
          where: mockWhere,
          include,
        });
        expect(result).toEqual(expectedTask);
      });
    });

    describe('when task does not exist', () => {
      it('should return null', async () => {
        // Arrange
        const where = { id: 'non-existent-id' };
        mockDatabaseService.task.findUnique.mockResolvedValue(null);

        // Act
        const result = await service.findUnique({ where });

        // Assert
        expect(result).toBeNull();
        expect(mockDatabaseService.task.findUnique).toHaveBeenCalledWith({
          where,
          select: undefined,
        });
      });
    });

    describe('error handling', () => {
      it('should propagate database errors', async () => {
        // Arrange
        const error = new Error('Database connection failed');
        mockDatabaseService.task.findUnique.mockRejectedValue(error);

        // Act & Assert
        await expect(service.findUnique({ where: mockWhere })).rejects.toThrow(
          'Database connection failed',
        );
        expect(mockDatabaseService.task.findUnique).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('findMany', () => {
    describe('when tasks exist', () => {
      it('should return array of tasks', async () => {
        // Arrange
        const params = {
          skip: 0,
          take: 10,
          where: { userId: 'user-id' },
          orderBy: { createdAt: 'desc' as const },
          include: { user: true },
        };
        const expectedTasks = [createMockTask()];
        mockDatabaseService.task.findMany.mockResolvedValue(expectedTasks);

        // Act
        const result = await service.findMany(params);

        // Assert
        expect(mockDatabaseService.task.findMany).toHaveBeenCalledTimes(1);
        expect(mockDatabaseService.task.findMany).toHaveBeenCalledWith(params);
        expect(result).toEqual(expectedTasks);
        expect(result).toHaveLength(1);
      });
    });

    describe('when no tasks match', () => {
      it('should return empty array', async () => {
        // Arrange
        mockDatabaseService.task.findMany.mockResolvedValue([]);

        // Act
        const result = await service.findMany({});

        // Assert
        expect(result).toEqual([]);
        expect(result).toHaveLength(0);
        expect(mockDatabaseService.task.findMany).toHaveBeenCalledWith({});
      });
    });

    describe('error handling', () => {
      it('should propagate database errors', async () => {
        // Arrange
        const error = new Error('Database connection failed');
        mockDatabaseService.task.findMany.mockRejectedValue(error);

        // Act & Assert
        await expect(service.findMany({})).rejects.toThrow(
          'Database connection failed',
        );
        expect(mockDatabaseService.task.findMany).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('count', () => {
    describe('when tasks match criteria', () => {
      it('should return count', async () => {
        // Arrange
        const where = { userId: 'user-id' };
        const expectedCount = 5;
        mockDatabaseService.task.count.mockResolvedValue(expectedCount);

        // Act
        const result = await service.count({ where });

        // Assert
        expect(mockDatabaseService.task.count).toHaveBeenCalledTimes(1);
        expect(mockDatabaseService.task.count).toHaveBeenCalledWith({ where });
        expect(result).toBe(expectedCount);
        expect(typeof result).toBe('number');
      });
    });

    describe('when no tasks match', () => {
      it('should return zero', async () => {
        // Arrange
        const where = { userId: 'non-existent-id' };
        mockDatabaseService.task.count.mockResolvedValue(0);

        // Act
        const result = await service.count({ where });

        // Assert
        expect(result).toBe(0);
        expect(mockDatabaseService.task.count).toHaveBeenCalledWith({ where });
      });
    });

    describe('error handling', () => {
      it('should propagate database errors', async () => {
        // Arrange
        const error = new Error('Database connection failed');
        mockDatabaseService.task.count.mockRejectedValue(error);

        // Act & Assert
        await expect(service.count({})).rejects.toThrow(
          'Database connection failed',
        );
        expect(mockDatabaseService.task.count).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('create', () => {
    const mockTaskData = {
      title: 'Test Task',
      description: 'Test Description',
      status: 'PENDING' as const,
      user: {
        connect: {
          id: 'user-id',
        },
      },
    };

    describe('successful creation', () => {
      it('should create task with included relations', async () => {
        // Arrange
        const include = { user: true };
        const expectedTask = createMockTask({ id: 'new-id' });
        mockDatabaseService.task.create.mockResolvedValue(expectedTask);

        // Act
        const result = await service.create({ data: mockTaskData, include });

        // Assert
        expect(mockDatabaseService.task.create).toHaveBeenCalledTimes(1);
        expect(mockDatabaseService.task.create).toHaveBeenCalledWith({
          data: mockTaskData,
          include,
        });
        expect(result).toEqual(expectedTask);
        expect(result.id).toBe('new-id');
      });
    });

    describe('error handling', () => {
      it('should propagate database errors', async () => {
        // Arrange
        const error = new Error('Database connection failed');
        mockDatabaseService.task.create.mockRejectedValue(error);

        // Act & Assert
        await expect(service.create({ data: mockTaskData })).rejects.toThrow(
          'Database connection failed',
        );
        expect(mockDatabaseService.task.create).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('update', () => {
    const mockWhere = { id: 'test-id' };
    const mockUpdateData = { title: 'Updated Task' };

    describe('successful update', () => {
      it('should update task with included relations', async () => {
        // Arrange
        const include = { user: true };
        const expectedTask = {
          ...createMockTask({ id: mockWhere.id }),
          ...mockUpdateData,
        };
        mockDatabaseService.task.update.mockResolvedValue(expectedTask);

        // Act
        const result = await service.update({
          where: mockWhere,
          data: mockUpdateData,
          include,
        });

        // Assert
        expect(mockDatabaseService.task.update).toHaveBeenCalledTimes(1);
        expect(mockDatabaseService.task.update).toHaveBeenCalledWith({
          where: mockWhere,
          data: mockUpdateData,
          include,
        });
        expect(result).toEqual(expectedTask);
        expect(result.title).toBe('Updated Task');
      });
    });

    describe('error handling', () => {
      it('should propagate error when task not found', async () => {
        // Arrange
        const where = { id: 'non-existent-id' };
        const error = new Error('Record to update does not exist');
        mockDatabaseService.task.update.mockRejectedValue(error);

        // Act & Assert
        await expect(
          service.update({ where, data: mockUpdateData }),
        ).rejects.toThrow('Record to update does not exist');
        expect(mockDatabaseService.task.update).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('delete', () => {
    const mockWhere = { id: 'test-id' };

    describe('successful deletion', () => {
      it('should delete task and return deleted task data', async () => {
        // Arrange
        const expectedDeletedTask = createMockTask({ id: mockWhere.id });
        mockDatabaseService.task.delete.mockResolvedValue(expectedDeletedTask);

        // Act
        const result = await service.delete({ where: mockWhere });

        // Assert
        expect(mockDatabaseService.task.delete).toHaveBeenCalledTimes(1);
        expect(mockDatabaseService.task.delete).toHaveBeenCalledWith({
          where: mockWhere,
        });
        expect(result).toEqual(expectedDeletedTask);
        expect(result.id).toBe('test-id');
      });
    });

    describe('error handling', () => {
      it('should propagate error when task not found', async () => {
        // Arrange
        const where = { id: 'non-existent-id' };
        const error = new Error('Record to delete does not exist');
        mockDatabaseService.task.delete.mockRejectedValue(error);

        // Act & Assert
        await expect(service.delete({ where })).rejects.toThrow(
          'Record to delete does not exist',
        );
        expect(mockDatabaseService.task.delete).toHaveBeenCalledTimes(1);
      });
    });
  });
});
