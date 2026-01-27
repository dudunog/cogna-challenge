import { Test, TestingModule } from '@nestjs/testing';
import { DeleteUserUseCase } from './delete-user.use-case';
import { UserService } from 'src/modules/user/user.service';
import { NotFoundException } from '@nestjs/common';
import { Prisma } from 'generated/prisma/client';

describe('DeleteUserUseCase', () => {
  let useCase: DeleteUserUseCase;
  let mockUserService: {
    findUnique: jest.Mock;
    delete: jest.Mock;
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
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteUserUseCase,
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    useCase = module.get<DeleteUserUseCase>(DeleteUserUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    describe('successful deletion', () => {
      it('should delete user when user exists', async () => {
        // Arrange
        const userId = 'user-id';
        const existingUser = createMockUser({ id: userId });
        const deletedUser = createMockUser({ id: userId });
        mockUserService.findUnique.mockResolvedValue(existingUser);
        mockUserService.delete.mockResolvedValue(deletedUser);

        // Act
        await useCase.execute(userId);

        // Assert
        expect(mockUserService.findUnique).toHaveBeenCalledTimes(1);
        expect(mockUserService.findUnique).toHaveBeenCalledWith({
          where: { id: userId },
        });
        expect(mockUserService.delete).toHaveBeenCalledTimes(1);
        expect(mockUserService.delete).toHaveBeenCalledWith({
          where: { id: userId },
        });
      });
    });

    describe('when user does not exist', () => {
      it('should throw NotFoundException', async () => {
        // Arrange
        const userId = 'non-existent-id';
        mockUserService.findUnique.mockResolvedValue(null);

        // Act & Assert
        await expect(useCase.execute(userId)).rejects.toThrow(
          NotFoundException,
        );
        await expect(useCase.execute(userId)).rejects.toThrow(
          `User with ID ${userId} not found`,
        );
        expect(mockUserService.findUnique).toHaveBeenCalledTimes(2);
        expect(mockUserService.delete).not.toHaveBeenCalled();
      });
    });

    describe('error handling', () => {
      it('should propagate database errors', async () => {
        // Arrange
        const userId = 'user-id';
        const existingUser = createMockUser({ id: userId });
        const error = new Error('Database connection failed');
        mockUserService.findUnique.mockResolvedValue(existingUser);
        mockUserService.delete.mockRejectedValue(error);

        // Act & Assert
        await expect(useCase.execute(userId)).rejects.toThrow(
          'Database connection failed',
        );
        expect(mockUserService.findUnique).toHaveBeenCalledTimes(1);
        expect(mockUserService.delete).toHaveBeenCalledTimes(1);
      });
    });
  });
});
