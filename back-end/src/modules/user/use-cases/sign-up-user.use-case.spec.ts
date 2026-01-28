import { Test, TestingModule } from '@nestjs/testing';
import { SignUpUserUseCase } from './sign-up-user.use-case';
import { UserService } from 'src/modules/user/user.service';
import { SignUpUserDto } from 'src/modules/user/dto/sign-up-user.dto';
import { createMockUser } from 'test/mocks/mock-user';

describe('SignUpUserUseCase', () => {
  let useCase: SignUpUserUseCase;
  let mockUserService: {
    create: jest.Mock;
    findUnique: jest.Mock;
  };

  beforeEach(async () => {
    mockUserService = {
      create: jest.fn(),
      findUnique: jest.fn(),
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
        mockUserService.findUnique.mockResolvedValue(null);
        mockUserService.create.mockResolvedValue(expectedUser);

        // Act
        const result = await useCase.execute(signUpUserDto);

        // Assert
        expect(mockUserService.findUnique).toHaveBeenCalledWith({
          where: { email: signUpUserDto.email },
        });
        expect(mockUserService.create).toHaveBeenCalledTimes(1);
        expect(mockUserService.create).toHaveBeenCalledWith({
          data: {
            email: signUpUserDto.email,
            name: signUpUserDto.name,
            password: expect.any(String),
          },
        });
        const createCall = mockUserService.create.mock.calls[0] as [
          { data: { password: string } },
        ];
        expect(createCall[0].data.password).not.toBe(signUpUserDto.password);
        expect(result.email).toBe(signUpUserDto.email);
      });
    });

    describe('error handling', () => {
      it('should throw ConflictException when user already exists', async () => {
        // Arrange
        const signUpUserDto: SignUpUserDto = {
          name: 'Test User',
          email: 'existing@example.com',
          password: 'password123',
        };
        mockUserService.findUnique.mockResolvedValue(
          createMockUser({ email: signUpUserDto.email }),
        );

        // Act & Assert
        await expect(useCase.execute(signUpUserDto)).rejects.toThrow(
          'User with this email already exists',
        );
        expect(mockUserService.findUnique).toHaveBeenCalledTimes(1);
        expect(mockUserService.create).not.toHaveBeenCalled();
      });

      it('should propagate database errors', async () => {
        // Arrange
        const signUpUserDto: SignUpUserDto = {
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
        };
        mockUserService.findUnique.mockResolvedValue(null);
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
