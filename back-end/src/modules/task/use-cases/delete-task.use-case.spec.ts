import { Test, TestingModule } from '@nestjs/testing';
import { DeleteTaskUseCase } from './delete-task.use-case';
import { TaskService } from 'src/modules/task/task.service';
import { NotFoundException } from '@nestjs/common';
import { createMockTask } from 'test/mocks/mock-task';

describe('DeleteTaskUseCase', () => {
  let useCase: DeleteTaskUseCase;
  let mockTaskService: {
    findUnique: jest.Mock;
    delete: jest.Mock;
  };

  beforeEach(async () => {
    mockTaskService = {
      findUnique: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteTaskUseCase,
        {
          provide: TaskService,
          useValue: mockTaskService,
        },
      ],
    }).compile();

    useCase = module.get<DeleteTaskUseCase>(DeleteTaskUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    describe('successful deletion', () => {
      it('should delete task and return deleted task data', async () => {
        // Arrange
        const taskId = 'task-id';
        const existingTask = createMockTask({ id: taskId });
        const deletedTask = createMockTask({ id: taskId });
        mockTaskService.findUnique.mockResolvedValue(existingTask);
        mockTaskService.delete.mockResolvedValue(deletedTask);

        // Act
        const result = await useCase.execute(taskId);

        // Assert
        expect(mockTaskService.findUnique).toHaveBeenCalledTimes(1);
        expect(mockTaskService.findUnique).toHaveBeenCalledWith({
          where: { id: taskId },
        });
        expect(mockTaskService.delete).toHaveBeenCalledTimes(1);
        expect(mockTaskService.delete).toHaveBeenCalledWith({
          where: { id: taskId },
        });
        expect(result).toEqual(deletedTask);
        expect(result.id).toBe(taskId);
      });
    });

    describe('when task does not exist', () => {
      it('should throw NotFoundException', async () => {
        // Arrange
        const taskId = 'non-existent-id';
        mockTaskService.findUnique.mockResolvedValue(null);

        // Act & Assert
        await expect(useCase.execute(taskId)).rejects.toThrow(
          NotFoundException,
        );
        await expect(useCase.execute(taskId)).rejects.toThrow(
          `Task with ID ${taskId} not found`,
        );
        expect(mockTaskService.findUnique).toHaveBeenCalledTimes(2);
        expect(mockTaskService.delete).not.toHaveBeenCalled();
      });
    });

    describe('error handling', () => {
      it('should propagate database errors from delete', async () => {
        // Arrange
        const taskId = 'task-id';
        const existingTask = createMockTask({ id: taskId });
        const error = new Error('Database connection failed');
        mockTaskService.findUnique.mockResolvedValue(existingTask);
        mockTaskService.delete.mockRejectedValue(error);

        // Act & Assert
        await expect(useCase.execute(taskId)).rejects.toThrow(
          'Database connection failed',
        );
        expect(mockTaskService.findUnique).toHaveBeenCalledTimes(1);
        expect(mockTaskService.delete).toHaveBeenCalledTimes(1);
      });
    });
  });
});
