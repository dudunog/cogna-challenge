import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { SignUpUserUseCase } from './use-cases/sign-up-user.use-case';
import { FindUserUseCase } from './use-cases/find-user.use-case';
import { UpdateUserUseCase } from './use-cases/update-user.use-case';
import { SignUpUserDto } from './dto/sign-up-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UserController', () => {
  let controller: UserController;

  const mockSignUpUserUseCase = {
    execute: jest.fn(),
  };

  const mockFindUserUseCase = {
    execute: jest.fn(),
  };

  const mockUpdateUserUseCase = {
    execute: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: SignUpUserUseCase,
          useValue: mockSignUpUserUseCase,
        },
        {
          provide: FindUserUseCase,
          useValue: mockFindUserUseCase,
        },
        {
          provide: UpdateUserUseCase,
          useValue: mockUpdateUserUseCase,
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
      const signUpUserDto: SignUpUserDto = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      };
      const expectedUser = {
        id: 'user-id',
        email: signUpUserDto.email,
      };
      mockSignUpUserUseCase.execute.mockResolvedValue(expectedUser);

      // Act
      const result = await controller.create(signUpUserDto);

      // Assert
      expect(mockSignUpUserUseCase.execute).toHaveBeenCalledTimes(1);
      expect(mockSignUpUserUseCase.execute).toHaveBeenCalledWith(signUpUserDto);
      expect(result).toEqual(expectedUser);
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
});
