import { Test, TestingModule } from '@nestjs/testing';
import { FindTaskUseCase } from './find-task.use-case';
import { TaskService } from 'src/modules/task/task.service';
import { NotFoundException } from '@nestjs/common';
import { createMockTask } from 'test/mocks/mock-task';

describe('FindTaskUseCase', () => {
  let useCase: FindTaskUseCase;
  let mockTaskService: {
    findUnique: jest.Mock;
  };

  beforeEach(async () => {
    mockTaskService = {
      findUnique: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindTaskUseCase,
        {
          provide: TaskService,
          useValue: mockTaskService,
        },
      ],
    }).compile();

    useCase = module.get<FindTaskUseCase>(FindTaskUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    describe('when task exists', () => {
      it('should return task data', async () => {
        // Arrange
        const taskId = 'task-id';
        const userId = 'user-id';
        const expectedTask = createMockTask({ id: taskId });
        mockTaskService.findUnique.mockResolvedValue(expectedTask);

        // Act
        const result = await useCase.execute(taskId, userId);

        // Assert
        expect(mockTaskService.findUnique).toHaveBeenCalledTimes(1);
        expect(mockTaskService.findUnique).toHaveBeenCalledWith({
          where: { id: taskId },
        });
        expect(result).toEqual(expectedTask);
        expect(result.id).toBe(taskId);
      });
    });

    describe('when task does not exist', () => {
      it('should throw NotFoundException', async () => {
        // Arrange
        const taskId = 'non-existent-id';
        const userId = 'user-id';
        mockTaskService.findUnique.mockResolvedValue(null);

        // Act & Assert
        await expect(useCase.execute(taskId, userId)).rejects.toThrow(
          NotFoundException,
        );
        await expect(useCase.execute(taskId, userId)).rejects.toThrow(
          `Tarefa com ID ${taskId} não encontrada`,
        );
        expect(mockTaskService.findUnique).toHaveBeenCalledTimes(2);
      });
    });

    describe('error handling', () => {
      it('should propagate database errors', async () => {
        // Arrange
        const taskId = 'task-id';
        const userId = 'user-id';
        const error = new Error('Database connection failed');
        mockTaskService.findUnique.mockRejectedValue(error);

        // Act & Assert
        await expect(useCase.execute(taskId, userId)).rejects.toThrow(
          'Database connection failed',
        );
        expect(mockTaskService.findUnique).toHaveBeenCalledTimes(1);
      });
    });
  });
});
