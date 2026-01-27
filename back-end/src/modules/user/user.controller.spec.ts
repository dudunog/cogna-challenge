import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { CreateUserUseCase } from './use-cases/create-user.use-case';
import { FindUserUseCase } from './use-cases/find-user.use-case';
import { FindUsersUseCase } from './use-cases/find-users.use-case';
import { UpdateUserUseCase } from './use-cases/update-user.use-case';
import { DeleteUserUseCase } from './use-cases/delete-user.use-case';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryUserDto } from './dto/query-user.dto';

describe('UserController', () => {
  let controller: UserController;

  const mockCreateUserUseCase = {
    execute: jest.fn(),
  };

  const mockFindUserUseCase = {
    execute: jest.fn(),
  };

  const mockFindUsersUseCase = {
    execute: jest.fn(),
  };

  const mockUpdateUserUseCase = {
    execute: jest.fn(),
  };

  const mockDeleteUserUseCase = {
    execute: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: CreateUserUseCase,
          useValue: mockCreateUserUseCase,
        },
        {
          provide: FindUserUseCase,
          useValue: mockFindUserUseCase,
        },
        {
          provide: FindUsersUseCase,
          useValue: mockFindUsersUseCase,
        },
        {
          provide: UpdateUserUseCase,
          useValue: mockUpdateUserUseCase,
        },
        {
          provide: DeleteUserUseCase,
          useValue: mockDeleteUserUseCase,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should delegate to create user use case and return created user', async () => {
      // Arrange
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password123',
      };
      const expectedUser = {
        id: 'user-id',
        email: createUserDto.email,
      };
      mockCreateUserUseCase.execute.mockResolvedValue(expectedUser);

      // Act
      const result = await controller.create(createUserDto);

      // Assert
      expect(mockCreateUserUseCase.execute).toHaveBeenCalledTimes(1);
      expect(mockCreateUserUseCase.execute).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual(expectedUser);
    });
  });

  describe('findAll', () => {
    it('should delegate to find users use case with query and return result', async () => {
      // Arrange
      const query: QueryUserDto = {
        skip: 0,
        take: 10,
        email: 'test',
        orderBy: 'desc',
      };
      const expectedResponse = {
        data: [
          {
            id: 'user-id',
            email: 'test@example.com',
          },
        ],
        meta: {
          total: 1,
          skip: 0,
          take: 10,
        },
      };
      mockFindUsersUseCase.execute.mockResolvedValue(expectedResponse);

      // Act
      const result = await controller.findAll(query);

      // Assert
      expect(mockFindUsersUseCase.execute).toHaveBeenCalledTimes(1);
      expect(mockFindUsersUseCase.execute).toHaveBeenCalledWith(query);
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('findOne', () => {
    it('should delegate to find user use case and return user', async () => {
      // Arrange
      const userId = 'user-id';
      const expectedUser = {
        id: userId,
        email: 'test@example.com',
      };
      mockFindUserUseCase.execute.mockResolvedValue(expectedUser);

      // Act
      const result = await controller.findOne(userId);

      // Assert
      expect(mockFindUserUseCase.execute).toHaveBeenCalledTimes(1);
      expect(mockFindUserUseCase.execute).toHaveBeenCalledWith(userId);
      expect(result).toEqual(expectedUser);
    });
  });

  describe('update', () => {
    it('should delegate to update user use case and return updated user', async () => {
      // Arrange
      const userId = 'user-id';
      const updateUserDto: UpdateUserDto = {
        email: 'updated@example.com',
      };
      const expectedUser = {
        id: userId,
        email: updateUserDto.email,
      };
      mockUpdateUserUseCase.execute.mockResolvedValue(expectedUser);

      // Act
      const result = await controller.update(userId, updateUserDto);

      // Assert
      expect(mockUpdateUserUseCase.execute).toHaveBeenCalledTimes(1);
      expect(mockUpdateUserUseCase.execute).toHaveBeenCalledWith(
        userId,
        updateUserDto,
      );
      expect(result).toEqual(expectedUser);
    });
  });

  describe('remove', () => {
    it('should delegate to delete user use case and not return content', async () => {
      // Arrange
      const userId = 'user-id';
      mockDeleteUserUseCase.execute.mockResolvedValue(undefined);

      // Act
      const result = await controller.remove(userId);

      // Assert
      expect(mockDeleteUserUseCase.execute).toHaveBeenCalledTimes(1);
      expect(mockDeleteUserUseCase.execute).toHaveBeenCalledWith(userId);
      expect(result).toBeUndefined();
    });
  });
});
