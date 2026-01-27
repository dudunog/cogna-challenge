import { Test, TestingModule } from '@nestjs/testing';
import { UpdateUserUseCase } from './update-user.use-case';
import { UserService } from 'src/modules/user/user.service';
import { UpdateUserDto } from 'src/modules/user/dto/update-user.dto';
import { NotFoundException } from '@nestjs/common';
import { Prisma } from 'generated/prisma/client';

describe('UpdateUserUseCase', () => {
  let useCase: UpdateUserUseCase;
  let mockUserService: {
    findUnique: jest.Mock;
    update: jest.Mock;
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
      findUnique: jest.fn(),
      update: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateUserUseCase,
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    useCase = module.get<UpdateUserUseCase>(UpdateUserUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    describe('successful update', () => {
      it('should update user and return updated user data', async () => {
        // Arrange
        const userId = 'user-id';
        const updateUserDto: UpdateUserDto = {
          email: 'updated@example.com',
        };
        const existingUser = createMockUser({ id: userId });
        const updatedUser = createMockUser({
          id: userId,
          email: updateUserDto.email,
        });
        mockUserService.findUnique.mockResolvedValue(existingUser);
        mockUserService.update.mockResolvedValue(updatedUser);

        // Act
        const result = await useCase.execute(userId, updateUserDto);

        // Assert
        expect(mockUserService.findUnique).toHaveBeenCalledTimes(1);
        expect(mockUserService.findUnique).toHaveBeenCalledWith({
          where: { id: userId },
        });
        expect(mockUserService.update).toHaveBeenCalledTimes(1);
        expect(mockUserService.update).toHaveBeenCalledWith({
          where: { id: userId },
          data: updateUserDto,
        });
        expect(result).toEqual(updatedUser);
        expect(result.email).toBe(updateUserDto.email);
      });

      it('should update password when password provided', async () => {
        // Arrange
        const userId = 'user-id';
        const updateUserDto: UpdateUserDto = {
          password: 'new-password',
        };
        const existingUser = createMockUser({ id: userId });
        const updatedUser = createMockUser({
          id: userId,
          password: updateUserDto.password,
        });
        mockUserService.findUnique.mockResolvedValue(existingUser);
        mockUserService.update.mockResolvedValue(updatedUser);

        // Act
        const result = await useCase.execute(userId, updateUserDto);

        // Assert
        expect(mockUserService.update).toHaveBeenCalledWith({
          where: { id: userId },
          data: updateUserDto,
        });
        expect(result.password).toBe(updateUserDto.password);
      });
    });

    describe('when user does not exist', () => {
      it('should throw NotFoundException', async () => {
        // Arrange
        const userId = 'non-existent-id';
        const updateUserDto: UpdateUserDto = {
          email: 'updated@example.com',
        };
        mockUserService.findUnique.mockResolvedValue(null);

        // Act & Assert
        await expect(useCase.execute(userId, updateUserDto)).rejects.toThrow(
          NotFoundException,
        );
        await expect(useCase.execute(userId, updateUserDto)).rejects.toThrow(
          `User with ID ${userId} not found`,
        );
        expect(mockUserService.findUnique).toHaveBeenCalledTimes(2);
        expect(mockUserService.update).not.toHaveBeenCalled();
      });
    });

    describe('error handling', () => {
      it('should propagate database errors from update', async () => {
        // Arrange
        const userId = 'user-id';
        const updateUserDto: UpdateUserDto = {
          email: 'updated@example.com',
        };
        const existingUser = createMockUser({ id: userId });
        const error = new Error('Database connection failed');
        mockUserService.findUnique.mockResolvedValue(existingUser);
        mockUserService.update.mockRejectedValue(error);

        // Act & Assert
        await expect(useCase.execute(userId, updateUserDto)).rejects.toThrow(
          'Database connection failed',
        );
        expect(mockUserService.findUnique).toHaveBeenCalledTimes(1);
        expect(mockUserService.update).toHaveBeenCalledTimes(1);
      });
    });
  });
});
