import { Test, TestingModule } from '@nestjs/testing';
import { CreateTaskUseCase } from './create-task.use-case';
import { TaskService } from 'src/modules/task/task.service';
import { CreateTaskDto } from 'src/modules/task/dto/create-task.dto';
import { createMockTask } from 'test/mocks/mock-task';
import { TaskStatus } from 'src/common/types/enums/task-status.enum';

describe('CreateTaskUseCase', () => {
  let useCase: CreateTaskUseCase;
  let mockTaskService: {
    create: jest.Mock;
  };

  beforeEach(async () => {
    mockTaskService = {
      create: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateTaskUseCase,
        {
          provide: TaskService,
          useValue: mockTaskService,
        },
      ],
    }).compile();

    useCase = module.get<CreateTaskUseCase>(CreateTaskUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    describe('successful creation', () => {
      it('should create task with default status PENDING when status is not provided', async () => {
        // Arrange
        const userId = 'user-id';
        const createTaskDto: CreateTaskDto = {
          title: 'Test Task',
          description: 'Test Description',
        };
        const expectedTask = createMockTask({
          title: createTaskDto.title,
          description: createTaskDto.description,
          userId,
        });
        mockTaskService.create.mockResolvedValue(expectedTask);

        // Act
        const result = await useCase.execute(createTaskDto, userId);

        // Assert
        expect(mockTaskService.create).toHaveBeenCalledTimes(1);
        expect(mockTaskService.create).toHaveBeenCalledWith({
          data: {
            title: createTaskDto.title,
            description: createTaskDto.description,
            status: TaskStatus.PENDING,
            user: {
              connect: {
                id: userId,
              },
            },
          },
        });
        expect(result).toEqual(expectedTask);
        expect(result.title).toBe(createTaskDto.title);
      });

      it('should create task with provided status when status is provided', async () => {
        // Arrange
        const userId = 'user-id';
        const createTaskDto: CreateTaskDto = {
          title: 'Test Task',
          description: 'Test Description',
          status: TaskStatus.IN_PROGRESS,
        };
        const expectedTask = createMockTask({
          title: createTaskDto.title,
          description: createTaskDto.description,
          status: createTaskDto.status,
          userId,
        });
        mockTaskService.create.mockResolvedValue(expectedTask);

        // Act
        const result = await useCase.execute(createTaskDto, userId);

        // Assert
        expect(mockTaskService.create).toHaveBeenCalledTimes(1);
        expect(mockTaskService.create).toHaveBeenCalledWith({
          data: {
            title: createTaskDto.title,
            description: createTaskDto.description,
            status: TaskStatus.IN_PROGRESS,
            user: {
              connect: {
                id: userId,
              },
            },
          },
        });
        expect(result).toEqual(expectedTask);
        expect(result.status).toBe(TaskStatus.IN_PROGRESS);
      });
    });

    describe('error handling', () => {
      it('should propagate database errors', async () => {
        // Arrange
        const userId = 'user-id';
        const createTaskDto: CreateTaskDto = {
          title: 'Test Task',
          description: 'Test Description',
        };
        const error = new Error('Database connection failed');
        mockTaskService.create.mockRejectedValue(error);

        // Act & Assert
        await expect(useCase.execute(createTaskDto, userId)).rejects.toThrow(
          'Database connection failed',
        );
        expect(mockTaskService.create).toHaveBeenCalledTimes(1);
      });
    });
  });
});
