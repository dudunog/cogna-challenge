import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginUseCase } from './login.use-case';
import { UserService } from 'src/modules/user/user.service';
import { LoginDto } from 'src/modules/auth/dto/login.dto';
import { createMockUser } from 'test/mocks/mock-user';

jest.mock('bcrypt');

describe('LoginUseCase', () => {
  let useCase: LoginUseCase;
  let mockUserService: {
    findUnique: jest.Mock;
  };
  let mockJwtService: {
    sign: jest.Mock;
  };

  beforeEach(async () => {
    mockUserService = {
      findUnique: jest.fn(),
    };

    mockJwtService = {
      sign: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoginUseCase,
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    useCase = module.get<LoginUseCase>(LoginUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    describe('successful login', () => {
      it('should return access token and user data when credentials are valid', async () => {
        // Arrange
        const loginDto: LoginDto = {
          email: 'test@example.com',
          password: 'password123',
        };
        const mockUser = createMockUser({
          email: loginDto.email,
          password: 'hashed-password',
        });
        const expectedToken = 'jwt-token';

        mockUserService.findUnique.mockResolvedValue(mockUser);
        (bcrypt.compare as jest.Mock).mockResolvedValue(true);
        mockJwtService.sign.mockReturnValue(expectedToken);

        // Act
        const result = await useCase.execute(loginDto);

        // Assert
        expect(mockUserService.findUnique).toHaveBeenCalledWith({
          where: { email: loginDto.email },
        });
        expect(bcrypt.compare).toHaveBeenCalledWith(
          loginDto.password,
          mockUser.password,
        );
        expect(mockJwtService.sign).toHaveBeenCalledWith({
          id: mockUser.id,
          email: mockUser.email,
        });
        expect(result).toEqual({
          access_token: expectedToken,
          user: {
            id: mockUser.id,
            email: mockUser.email,
          },
        });
      });
    });

    describe('error handling', () => {
      it('should throw UnauthorizedException when user is not found', async () => {
        // Arrange
        const loginDto: LoginDto = {
          email: 'nonexistent@example.com',
          password: 'password123',
        };
        mockUserService.findUnique.mockResolvedValue(null);

        // Act & Assert
        await expect(useCase.execute(loginDto)).rejects.toThrow(
          UnauthorizedException,
        );
        await expect(useCase.execute(loginDto)).rejects.toThrow(
          'Invalid credentials',
        );
        expect(bcrypt.compare).not.toHaveBeenCalled();
        expect(mockJwtService.sign).not.toHaveBeenCalled();
      });

      it('should throw UnauthorizedException when password is invalid', async () => {
        // Arrange
        const loginDto: LoginDto = {
          email: 'test@example.com',
          password: 'wrongpassword',
        };
        const mockUser = createMockUser({
          email: loginDto.email,
          password: 'hashed-password',
        });

        mockUserService.findUnique.mockResolvedValue(mockUser);
        (bcrypt.compare as jest.Mock).mockResolvedValue(false);

        // Act & Assert
        await expect(useCase.execute(loginDto)).rejects.toThrow(
          UnauthorizedException,
        );
        await expect(useCase.execute(loginDto)).rejects.toThrow(
          'Invalid credentials',
        );
        expect(mockJwtService.sign).not.toHaveBeenCalled();
      });

      it('should propagate database errors', async () => {
        // Arrange
        const loginDto: LoginDto = {
          email: 'test@example.com',
          password: 'password123',
        };
        const error = new Error('Database connection failed');
        mockUserService.findUnique.mockRejectedValue(error);

        // Act & Assert
        await expect(useCase.execute(loginDto)).rejects.toThrow(
          'Database connection failed',
        );
        expect(bcrypt.compare).not.toHaveBeenCalled();
        expect(mockJwtService.sign).not.toHaveBeenCalled();
      });
    });
  });
});
