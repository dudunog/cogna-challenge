import { Test, TestingModule } from '@nestjs/testing';
import { CreateTaskUseCase } from './create-task.use-case';
import { TaskService } from 'src/modules/task/task.service';
import { CreateTaskDto } from 'src/modules/task/dto/create-task.dto';
import { createMockTask } from 'test/mocks/mock-task';
import { TaskStatus } from 'generated/prisma/client';

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
        const createTaskDto: CreateTaskDto = {
          title: 'Test Task',
          description: 'Test Description',
          userId: 'user-id',
        };
        const expectedTask = createMockTask({
          title: createTaskDto.title,
          description: createTaskDto.description,
          userId: createTaskDto.userId,
        });
        mockTaskService.create.mockResolvedValue(expectedTask);

        // Act
        const result = await useCase.execute(createTaskDto);

        // Assert
        expect(mockTaskService.create).toHaveBeenCalledTimes(1);
        expect(mockTaskService.create).toHaveBeenCalledWith({
          data: {
            title: createTaskDto.title,
            description: createTaskDto.description,
            status: TaskStatus.PENDING,
            user: {
              connect: {
                id: createTaskDto.userId,
              },
            },
          },
        });
        expect(result).toEqual(expectedTask);
        expect(result.title).toBe(createTaskDto.title);
      });

      it('should create task with provided status when status is provided', async () => {
        // Arrange
        const createTaskDto: CreateTaskDto = {
          title: 'Test Task',
          description: 'Test Description',
          status: TaskStatus.IN_PROGRESS,
          userId: 'user-id',
        };
        const expectedTask = createMockTask({
          title: createTaskDto.title,
          description: createTaskDto.description,
          status: createTaskDto.status,
          userId: createTaskDto.userId,
        });
        mockTaskService.create.mockResolvedValue(expectedTask);

        // Act
        const result = await useCase.execute(createTaskDto);

        // Assert
        expect(mockTaskService.create).toHaveBeenCalledTimes(1);
        expect(mockTaskService.create).toHaveBeenCalledWith({
          data: {
            title: createTaskDto.title,
            description: createTaskDto.description,
            status: TaskStatus.IN_PROGRESS,
            user: {
              connect: {
                id: createTaskDto.userId,
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
        const createTaskDto: CreateTaskDto = {
          title: 'Test Task',
          description: 'Test Description',
          userId: 'user-id',
        };
        const error = new Error('Database connection failed');
        mockTaskService.create.mockRejectedValue(error);

        // Act & Assert
        await expect(useCase.execute(createTaskDto)).rejects.toThrow(
          'Database connection failed',
        );
        expect(mockTaskService.create).toHaveBeenCalledTimes(1);
      });
    });
  });
});
