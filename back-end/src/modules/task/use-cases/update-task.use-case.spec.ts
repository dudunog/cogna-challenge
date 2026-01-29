import { Test, TestingModule } from '@nestjs/testing';
import { UpdateTaskUseCase } from './update-task.use-case';
import { TaskService } from 'src/modules/task/task.service';
import { UpdateTaskDto } from 'src/modules/task/dto/update-task.dto';
import { NotFoundException } from '@nestjs/common';
import { createMockTask } from 'test/mocks/mock-task';

describe('UpdateTaskUseCase', () => {
  let useCase: UpdateTaskUseCase;
  let mockTaskService: {
    findUnique: jest.Mock;
    update: jest.Mock;
  };

  beforeEach(async () => {
    mockTaskService = {
      findUnique: jest.fn(),
      update: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateTaskUseCase,
        {
          provide: TaskService,
          useValue: mockTaskService,
        },
      ],
    }).compile();

    useCase = module.get<UpdateTaskUseCase>(UpdateTaskUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    describe('successful update', () => {
      it('should update task and return updated task data', async () => {
        // Arrange
        const taskId = 'task-id';
        const userId = 'user-id';
        const updateTaskDto: UpdateTaskDto = {
          title: 'Updated Task',
        };
        const existingTask = createMockTask({ id: taskId });
        const updatedTask = createMockTask({
          id: taskId,
          title: updateTaskDto.title,
        });
        mockTaskService.findUnique.mockResolvedValue(existingTask);
        mockTaskService.update.mockResolvedValue(updatedTask);

        // Act
        const result = await useCase.execute(taskId, updateTaskDto, userId);

        // Assert
        expect(mockTaskService.findUnique).toHaveBeenCalledTimes(1);
        expect(mockTaskService.findUnique).toHaveBeenCalledWith({
          where: { id: taskId },
        });
        expect(mockTaskService.update).toHaveBeenCalledTimes(1);
        expect(mockTaskService.update).toHaveBeenCalledWith({
          where: { id: taskId },
          data: updateTaskDto,
        });
        expect(result).toEqual(updatedTask);
        expect(result.title).toBe(updateTaskDto.title);
      });
    });

    describe('when task does not exist', () => {
      it('should throw NotFoundException', async () => {
        // Arrange
        const taskId = 'non-existent-id';
        const userId = 'user-id';
        const updateTaskDto: UpdateTaskDto = {
          title: 'Updated Task',
        };
        mockTaskService.findUnique.mockResolvedValue(null);

        // Act & Assert
        await expect(
          useCase.execute(taskId, updateTaskDto, userId),
        ).rejects.toThrow(NotFoundException);
        await expect(
          useCase.execute(taskId, updateTaskDto, userId),
        ).rejects.toThrow(`Tarefa com ID ${taskId} não encontrada`);
        expect(mockTaskService.findUnique).toHaveBeenCalledTimes(2);
        expect(mockTaskService.update).not.toHaveBeenCalled();
      });
    });

    describe('error handling', () => {
      it('should propagate database errors from update', async () => {
        // Arrange
        const taskId = 'task-id';
        const userId = 'user-id';
        const updateTaskDto: UpdateTaskDto = {
          title: 'Updated Task',
        };
        const existingTask = createMockTask({ id: taskId });
        const error = new Error('Database connection failed');
        mockTaskService.findUnique.mockResolvedValue(existingTask);
        mockTaskService.update.mockRejectedValue(error);

        // Act & Assert
        await expect(
          useCase.execute(taskId, updateTaskDto, userId),
        ).rejects.toThrow('Database connection failed');
        expect(mockTaskService.findUnique).toHaveBeenCalledTimes(1);
        expect(mockTaskService.update).toHaveBeenCalledTimes(1);
      });
    });
  });
});
