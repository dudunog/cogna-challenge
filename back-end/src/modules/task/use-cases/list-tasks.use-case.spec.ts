import { Test, TestingModule } from '@nestjs/testing';
import { ListTasksUseCase } from './list-tasks.use-case';
import { TaskService } from 'src/modules/task/task.service';
import { createMockTask } from 'test/mocks/mock-task';

describe('ListTasksUseCase', () => {
  let useCase: ListTasksUseCase;
  let mockTaskService: {
    findMany: jest.Mock;
  };

  beforeEach(async () => {
    mockTaskService = {
      findMany: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListTasksUseCase,
        {
          provide: TaskService,
          useValue: mockTaskService,
        },
      ],
    }).compile();

    useCase = module.get<ListTasksUseCase>(ListTasksUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    describe('when tasks exist', () => {
      it('should return array of tasks', async () => {
        // Arrange
        const params = {
          skip: 0,
          take: 10,
          where: { userId: 'user-id' },
          orderBy: { createdAt: 'desc' as const },
        };
        const expectedTasks = [createMockTask()];
        mockTaskService.findMany.mockResolvedValue(expectedTasks);

        // Act
        const result = await useCase.execute(params);

        // Assert
        expect(mockTaskService.findMany).toHaveBeenCalledTimes(1);
        expect(mockTaskService.findMany).toHaveBeenCalledWith(params);
        expect(result).toEqual(expectedTasks);
        expect(result).toHaveLength(1);
      });
    });

    describe('when no tasks match', () => {
      it('should return empty array', async () => {
        // Arrange
        mockTaskService.findMany.mockResolvedValue([]);

        // Act
        const result = await useCase.execute({});

        // Assert
        expect(result).toEqual([]);
        expect(result).toHaveLength(0);
        expect(mockTaskService.findMany).toHaveBeenCalledWith({});
      });
    });

    describe('error handling', () => {
      it('should propagate database errors', async () => {
        // Arrange
        const error = new Error('Database connection failed');
        mockTaskService.findMany.mockRejectedValue(error);

        // Act & Assert
        await expect(useCase.execute({})).rejects.toThrow(
          'Database connection failed',
        );
        expect(mockTaskService.findMany).toHaveBeenCalledTimes(1);
      });
    });
  });
});
