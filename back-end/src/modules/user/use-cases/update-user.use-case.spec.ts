import { Test, TestingModule } from '@nestjs/testing';
import { UpdateUserUseCase } from './update-user.use-case';
import { UserService } from 'src/modules/user/user.service';
import { UpdateUserDto } from 'src/modules/user/dto/update-user.dto';
import { NotFoundException } from '@nestjs/common';
import { createMockUser } from 'test/mocks/mock-user';

describe('UpdateUserUseCase', () => {
  let useCase: UpdateUserUseCase;
  let mockUserService: {
    findUnique: jest.Mock;
    update: jest.Mock;
  };

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
          `Usuário com ID ${userId} não encontrado`,
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
