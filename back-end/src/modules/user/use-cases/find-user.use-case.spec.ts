import { Test, TestingModule } from '@nestjs/testing';
import { FindUserUseCase } from './find-user.use-case';
import { UserService } from 'src/modules/user/user.service';
import { NotFoundException } from '@nestjs/common';
import { Prisma } from 'generated/prisma/client';

describe('FindUserUseCase', () => {
  let useCase: FindUserUseCase;
  let mockUserService: {
    findUnique: jest.Mock;
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
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindUserUseCase,
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    useCase = module.get<FindUserUseCase>(FindUserUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    describe('when user exists', () => {
      it('should return user data', async () => {
        // Arrange
        const userId = 'user-id';
        const expectedUser = createMockUser({ id: userId });
        mockUserService.findUnique.mockResolvedValue(expectedUser);

        // Act
        const result = await useCase.execute(userId);

        // Assert
        expect(mockUserService.findUnique).toHaveBeenCalledTimes(1);
        expect(mockUserService.findUnique).toHaveBeenCalledWith({
          where: { id: userId },
        });
        expect(result).toEqual(expectedUser);
        expect(result.id).toBe(userId);
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
      });
    });

    describe('error handling', () => {
      it('should propagate database errors', async () => {
        // Arrange
        const userId = 'user-id';
        const error = new Error('Database connection failed');
        mockUserService.findUnique.mockRejectedValue(error);

        // Act & Assert
        await expect(useCase.execute(userId)).rejects.toThrow(
          'Database connection failed',
        );
        expect(mockUserService.findUnique).toHaveBeenCalledTimes(1);
      });
    });
  });
});
