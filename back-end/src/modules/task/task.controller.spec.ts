import { Test, TestingModule } from '@nestjs/testing';
import { TaskController } from './task.controller';
import { CreateTaskUseCase } from './use-cases/create-task.use-case';
import { FindTaskUseCase } from './use-cases/find-task.use-case';
import { ListTasksUseCase } from './use-cases/list-tasks.use-case';
import { UpdateTaskUseCase } from './use-cases/update-task.use-case';
import { DeleteTaskUseCase } from './use-cases/delete-task.use-case';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

describe('TaskController', () => {
  let controller: TaskController;

  const mockCreateTaskUseCase = {
    execute: jest.fn(),
  };

  const mockFindTaskUseCase = {
    execute: jest.fn(),
  };

  const mockListTasksUseCase = {
    execute: jest.fn(),
  };

  const mockUpdateTaskUseCase = {
    execute: jest.fn(),
  };

  const mockDeleteTaskUseCase = {
    execute: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [
        {
          provide: CreateTaskUseCase,
          useValue: mockCreateTaskUseCase,
        },
        {
          provide: FindTaskUseCase,
          useValue: mockFindTaskUseCase,
        },
        {
          provide: ListTasksUseCase,
          useValue: mockListTasksUseCase,
        },
        {
          provide: UpdateTaskUseCase,
          useValue: mockUpdateTaskUseCase,
        },
        {
          provide: DeleteTaskUseCase,
          useValue: mockDeleteTaskUseCase,
        },
      ],
    }).compile();

    controller = module.get<TaskController>(TaskController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should delegate to create task use case and return created task', async () => {
      // Arrange
      const user = { id: 'user-id', email: 'test@example.com' };
      const createTaskDto: CreateTaskDto = {
        title: 'Test Task',
        description: 'Test Description',
      };
      const expectedTask = {
        id: 'task-id',
        title: createTaskDto.title,
        description: createTaskDto.description,
      };
      mockCreateTaskUseCase.execute.mockResolvedValue(expectedTask);

      // Act
      const result = await controller.create(createTaskDto, user);

      // Assert
      expect(mockCreateTaskUseCase.execute).toHaveBeenCalledTimes(1);
      expect(mockCreateTaskUseCase.execute).toHaveBeenCalledWith(
        createTaskDto,
        user.id,
      );
      expect(result).toEqual(expectedTask);
    });
  });

  describe('findAll', () => {
    it('should delegate to list tasks use case and return array of tasks', async () => {
      // Arrange
      const user = { id: 'user-id', email: 'test@example.com' };
      const expectedTasks = [
        {
          id: 'task-id-1',
          title: 'Test Task 1',
          description: 'Test Description 1',
        },
        {
          id: 'task-id-2',
          title: 'Test Task 2',
          description: 'Test Description 2',
        },
      ];
      mockListTasksUseCase.execute.mockResolvedValue(expectedTasks);

      // Act
      const result = await controller.findAll(user);

      // Assert
      expect(mockListTasksUseCase.execute).toHaveBeenCalledTimes(1);
      expect(mockListTasksUseCase.execute).toHaveBeenCalledWith(user.id, {});
      expect(result).toEqual(expectedTasks);
    });
  });

  describe('findOne', () => {
    it('should delegate to find task use case and return task', async () => {
      // Arrange
      const user = { id: 'user-id', email: 'test@example.com' };
      const taskId = 'task-id';
      const expectedTask = {
        id: taskId,
        title: 'Test Task',
        description: 'Test Description',
      };
      mockFindTaskUseCase.execute.mockResolvedValue(expectedTask);

      // Act
      const result = await controller.findOne(taskId, user);

      // Assert
      expect(mockFindTaskUseCase.execute).toHaveBeenCalledTimes(1);
      expect(mockFindTaskUseCase.execute).toHaveBeenCalledWith(taskId, user.id);
      expect(result).toEqual(expectedTask);
    });
  });

  describe('update', () => {
    it('should delegate to update task use case and return updated task', async () => {
      // Arrange
      const user = { id: 'user-id', email: 'test@example.com' };
      const taskId = 'task-id';
      const updateTaskDto: UpdateTaskDto = {
        title: 'Updated Task',
      };
      const expectedTask = {
        id: taskId,
        title: updateTaskDto.title,
      };
      mockUpdateTaskUseCase.execute.mockResolvedValue(expectedTask);

      // Act
      const result = await controller.update(taskId, updateTaskDto, user);

      // Assert
      expect(mockUpdateTaskUseCase.execute).toHaveBeenCalledTimes(1);
      expect(mockUpdateTaskUseCase.execute).toHaveBeenCalledWith(
        taskId,
        updateTaskDto,
        user.id,
      );
      expect(result).toEqual(expectedTask);
    });
  });

  describe('delete', () => {
    it('should delegate to delete task use case', async () => {
      // Arrange
      const user = { id: 'user-id', email: 'test@example.com' };
      const taskId = 'task-id';
      mockDeleteTaskUseCase.execute.mockResolvedValue(undefined);

      // Act
      const result = await controller.delete(taskId, user);

      // Assert
      expect(mockDeleteTaskUseCase.execute).toHaveBeenCalledTimes(1);
      expect(mockDeleteTaskUseCase.execute).toHaveBeenCalledWith(
        taskId,
        user.id,
      );
      expect(result).toBeUndefined();
    });
  });
});
