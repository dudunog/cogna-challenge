import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserUseCase } from './create-user.use-case';
import { UserService } from 'src/modules/user/user.service';
import { CreateUserDto } from 'src/modules/user/dto/create-user.dto';
import { Prisma } from 'generated/prisma/client';

describe('CreateUserUseCase', () => {
  let useCase: CreateUserUseCase;
  let mockUserService: {
    create: jest.Mock;
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
      create: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateUserUseCase,
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    useCase = module.get<CreateUserUseCase>(CreateUserUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    describe('successful creation', () => {
      it('should create user and return created user data', async () => {
        // Arrange
        const createUserDto: CreateUserDto = {
          email: 'test@example.com',
          password: 'password123',
        };
        const expectedUser = createMockUser({
          email: createUserDto.email,
        });
        mockUserService.create.mockResolvedValue(expectedUser);

        // Act
        const result = await useCase.execute(createUserDto);

        // Assert
        expect(mockUserService.create).toHaveBeenCalledTimes(1);
        expect(mockUserService.create).toHaveBeenCalledWith({
          data: createUserDto,
        });
        expect(result).toEqual(expectedUser);
        expect(result.email).toBe(createUserDto.email);
      });
    });

    describe('error handling', () => {
      it('should propagate unique constraint violation errors', async () => {
        // Arrange
        const createUserDto: CreateUserDto = {
          email: 'existing@example.com',
          password: 'password123',
        };
        const error = new Error('Unique constraint violation');
        mockUserService.create.mockRejectedValue(error);

        // Act & Assert
        await expect(useCase.execute(createUserDto)).rejects.toThrow(
          'Unique constraint violation',
        );
        expect(mockUserService.create).toHaveBeenCalledTimes(1);
      });

      it('should propagate database errors', async () => {
        // Arrange
        const createUserDto: CreateUserDto = {
          email: 'test@example.com',
          password: 'password123',
        };
        const error = new Error('Database connection failed');
        mockUserService.create.mockRejectedValue(error);

        // Act & Assert
        await expect(useCase.execute(createUserDto)).rejects.toThrow(
          'Database connection failed',
        );
        expect(mockUserService.create).toHaveBeenCalledTimes(1);
      });
    });
  });
});
