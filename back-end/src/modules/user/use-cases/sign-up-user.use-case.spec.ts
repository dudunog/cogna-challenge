import { Test, TestingModule } from '@nestjs/testing';
import { SignUpUserUseCase } from './sign-up-user.use-case';
import { UserService } from 'src/modules/user/user.service';
import { SignUpUserDto } from 'src/modules/user/dto/sign-up-user.dto';
import { createMockUser } from 'test/mocks/mock-user';

describe('SignUpUserUseCase', () => {
  let useCase: SignUpUserUseCase;
  let mockUserService: {
    create: jest.Mock;
  };

  beforeEach(async () => {
    mockUserService = {
      create: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SignUpUserUseCase,
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    useCase = module.get<SignUpUserUseCase>(SignUpUserUseCase);
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
        const signUpUserDto: SignUpUserDto = {
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
        };
        const expectedUser = createMockUser({
          email: signUpUserDto.email,
        });
        mockUserService.create.mockResolvedValue(expectedUser);

        // Act
        const result = await useCase.execute(signUpUserDto);

        // Assert
        expect(mockUserService.create).toHaveBeenCalledTimes(1);
        expect(mockUserService.create).toHaveBeenCalledWith({
          data: signUpUserDto,
        });
        expect(result).toEqual(expectedUser);
        expect(result.email).toBe(signUpUserDto.email);
      });
    });

    describe('error handling', () => {
      it('should propagate unique constraint violation errors', async () => {
        // Arrange
        const signUpUserDto: SignUpUserDto = {
          name: 'Test User',
          email: 'existing@example.com',
          password: 'password123',
        };
        const error = new Error('Unique constraint violation');
        mockUserService.create.mockRejectedValue(error);

        // Act & Assert
        await expect(useCase.execute(signUpUserDto)).rejects.toThrow(
          'Unique constraint violation',
        );
        expect(mockUserService.create).toHaveBeenCalledTimes(1);
      });

      it('should propagate database errors', async () => {
        // Arrange
        const signUpUserDto: SignUpUserDto = {
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
        };
        const error = new Error('Database connection failed');
        mockUserService.create.mockRejectedValue(error);

        // Act & Assert
        await expect(useCase.execute(signUpUserDto)).rejects.toThrow(
          'Database connection failed',
        );
        expect(mockUserService.create).toHaveBeenCalledTimes(1);
      });
    });
  });
});
