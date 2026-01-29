import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { LoginUseCase } from './use-cases/login.use-case';
import { LoginDto } from './dto/login.dto';

describe('AuthController', () => {
  let controller: AuthController;

  const mockLoginUseCase = {
    execute: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: LoginUseCase,
          useValue: mockLoginUseCase,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should delegate to login use case and return access token with user', async () => {
      // Arrange
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password123',
      };
      const expectedResult = {
        access_token: 'jwt-token',
        user: {
          id: 'user-id',
          email: loginDto.email,
        },
      };
      mockLoginUseCase.execute.mockResolvedValue(expectedResult);

      // Act
      const result = await controller.login(loginDto);

      // Assert
      expect(mockLoginUseCase.execute).toHaveBeenCalledTimes(1);
      expect(mockLoginUseCase.execute).toHaveBeenCalledWith(loginDto);
      expect(result).toEqual(expectedResult);
    });

    it('should propagate errors from login use case', async () => {
      // Arrange
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };
      const error = new Error('Credenciais inválidas');
      mockLoginUseCase.execute.mockRejectedValue(error);

      // Act & Assert
      await expect(controller.login(loginDto)).rejects.toThrow(
        'Credenciais inválidas',
      );
      expect(mockLoginUseCase.execute).toHaveBeenCalledTimes(1);
      expect(mockLoginUseCase.execute).toHaveBeenCalledWith(loginDto);
    });
  });
});
