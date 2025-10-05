import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { VendorsService } from '../vendors/vendors.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException, NotFoundException, BadRequestException } from '@nestjs/common';
import { UserRole } from '../../common/enums/user-role.enum';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let vendorsService: VendorsService;
  let jwtService: JwtService;

  const mockUsersService = {
    findByEmail: jest.fn(),
    create: jest.fn(),
    updateRefreshToken: jest.fn(),
    findOneDocument: jest.fn(),
    setPasswordResetToken: jest.fn(),
    findByPasswordResetToken: jest.fn(),
    updatePassword: jest.fn(),
    clearPasswordResetToken: jest.fn(),
    setEmailVerificationToken: jest.fn(),
    findByEmailVerificationToken: jest.fn(),
    verifyEmail: jest.fn(),
  };

  const mockVendorsService = {
    create: jest.fn(),
    updateByUserId: jest.fn(),
    findByUserId: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
    verify: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: VendorsService,
          useValue: mockVendorsService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    vendorsService = module.get<VendorsService>(VendorsService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should validate user with correct credentials', async () => {
      const email = 'test@example.com';
      const password = 'password123';
      const hashedPassword = await bcrypt.hash(password, 10);

      const mockUser = {
        email,
        password: hashedPassword,
        roles: [UserRole.CUSTOMER],
        toObject: jest.fn().mockReturnValue({
          email,
          password: hashedPassword,
          roles: [UserRole.CUSTOMER],
        }),
      };

      mockUsersService.findByEmail.mockResolvedValue(mockUser);

      const result = await service.validateUser(email, password);

      expect(result).toBeDefined();
      expect(result.email).toBe(email);
      expect(result.roles).toEqual([UserRole.CUSTOMER]);
      expect(mockUsersService.findByEmail).toHaveBeenCalledWith(email);
    });

    it('should return null for invalid credentials', async () => {
      const email = 'test@example.com';
      const password = 'wrongpassword';

      const mockUser = {
        email,
        password: 'hashedpassword',
        roles: [UserRole.CUSTOMER],
        toObject: jest.fn().mockReturnValue({
          email,
          password: 'hashedpassword',
          roles: [UserRole.CUSTOMER],
        }),
      };

      mockUsersService.findByEmail.mockResolvedValue(mockUser);

      const result = await service.validateUser(email, password);

      expect(result).toBeNull();
    });

    it('should return null for non-existent user', async () => {
      const email = 'nonexistent@example.com';
      const password = 'password123';

      mockUsersService.findByEmail.mockResolvedValue(null);

      const result = await service.validateUser(email, password);

      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should login user successfully', async () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const hashedPassword = await bcrypt.hash(loginDto.password, 10);
      const mockUser = {
        _id: 'user_id',
        email: loginDto.email,
        password: hashedPassword,
        roles: [UserRole.CUSTOMER],
        profile: {},
        toObject: jest.fn().mockReturnValue({
          _id: 'user_id',
          email: loginDto.email,
          password: hashedPassword,
          roles: [UserRole.CUSTOMER],
          profile: {},
        }),
      };

      const mockPayload = {
        email: loginDto.email,
        sub: 'user_id',
        role: [UserRole.CUSTOMER],
      };

      mockUsersService.findByEmail.mockResolvedValue(mockUser);
      mockJwtService.sign.mockReturnValue('access_token');
      mockJwtService.sign.mockReturnValueOnce('access_token').mockReturnValueOnce('refresh_token');
      mockUsersService.updateRefreshToken.mockResolvedValue(undefined);

      const result = await service.login(loginDto);

      expect(result).toEqual({
        access_token: 'access_token',
        refresh_token: 'refresh_token',
        user: {
          id: 'user_id',
          email: loginDto.email,
          roles: [UserRole.CUSTOMER],
          profile: {},
        },
      });
      expect(mockJwtService.sign).toHaveBeenCalledTimes(2);
      expect(mockUsersService.updateRefreshToken).toHaveBeenCalledWith('user_id', 'refresh_token');
    });

    it('should throw UnauthorizedException for invalid credentials', async () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      mockUsersService.findByEmail.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('register', () => {
    it('should register user successfully', async () => {
      const createUserDto = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
        phone: '+2348012345678',
      };

      const mockUser = {
        _id: 'user_id',
        email: createUserDto.email,
        password: 'hashedpassword',
        roles: [UserRole.CUSTOMER],
        toObject: jest.fn().mockReturnValue({
          _id: 'user_id',
          email: createUserDto.email,
          password: 'hashedpassword',
          roles: [UserRole.CUSTOMER],
        }),
      };

      mockUsersService.create.mockResolvedValue(mockUser);

      const result = await service.register(createUserDto);

      expect(result).toBeDefined();
      expect(result.email).toBe(createUserDto.email);
      expect(mockUsersService.create).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('registerCustomer', () => {
    it('should register customer successfully', async () => {
      const registerCustomerDto = {
        email: 'customer@example.com',
        password: 'password123',
        firstName: 'Jane',
        lastName: 'Smith',
        phoneNumber: '+2348012345678',
      };

      const mockUser = {
        _id: 'user_id',
        email: registerCustomerDto.email,
        password: 'hashedpassword',
        roles: [UserRole.CUSTOMER],
        toObject: jest.fn().mockReturnValue({
          _id: 'user_id',
          email: registerCustomerDto.email,
          password: 'hashedpassword',
          roles: [UserRole.CUSTOMER],
        }),
      };

      mockUsersService.create.mockResolvedValue(mockUser);

      const result = await service.registerCustomer(registerCustomerDto);

      expect(result).toBeDefined();
      expect(result.email).toBe(registerCustomerDto.email);
      expect(mockUsersService.create).toHaveBeenCalledWith({
        email: registerCustomerDto.email,
        password: registerCustomerDto.password,
        roles: [UserRole.CUSTOMER],
        firstName: registerCustomerDto.firstName,
        lastName: registerCustomerDto.lastName,
        phone: registerCustomerDto.phoneNumber,
      });
    });
  });

  describe('refreshToken', () => {
    it('should refresh token successfully', async () => {
      const token = 'refresh_token';
      const payload = {
        sub: 'user_id',
        email: 'test@example.com',
        roles: [UserRole.CUSTOMER],
      };

      const mockUser = {
        _id: 'user_id',
        email: 'test@example.com',
        roles: [UserRole.CUSTOMER],
      };

      mockJwtService.verify.mockReturnValue(payload);
      mockUsersService.findOneDocument.mockResolvedValue(mockUser);
      mockJwtService.sign.mockReturnValue('new_access_token');

      const result = await service.refreshToken(token);

      expect(result).toEqual({ access_token: 'new_access_token' });
      expect(mockJwtService.verify).toHaveBeenCalledWith(token);
      expect(mockUsersService.findOneDocument).toHaveBeenCalledWith(payload.sub);
    });

    it('should throw UnauthorizedException for invalid token', async () => {
      const token = 'invalid_token';

      mockJwtService.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await expect(service.refreshToken(token)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('logout', () => {
    it('should logout user successfully', async () => {
      const userId = 'user_id';

      mockUsersService.updateRefreshToken.mockResolvedValue(undefined);

      const result = await service.logout(userId);

      expect(result).toEqual({ message: 'Logged out successfully' });
      expect(mockUsersService.updateRefreshToken).toHaveBeenCalledWith(userId, null);
    });
  });

  describe('forgotPassword', () => {
    it('should send password reset email successfully', async () => {
      const email = 'test@example.com';
      const mockUser = {
        _id: 'user_id',
        email,
      };

      mockUsersService.findByEmail.mockResolvedValue(mockUser);
      mockUsersService.setPasswordResetToken.mockResolvedValue(undefined);

      const result = await service.forgotPassword(email);

      expect(result).toEqual({ message: 'Password reset email sent' });
      expect(mockUsersService.findByEmail).toHaveBeenCalledWith(email);
      expect(mockUsersService.setPasswordResetToken).toHaveBeenCalledWith('user_id', expect.any(String));
    });

    it('should throw NotFoundException for non-existent user', async () => {
      const email = 'nonexistent@example.com';

      mockUsersService.findByEmail.mockResolvedValue(null);

      await expect(service.forgotPassword(email)).rejects.toThrow(NotFoundException);
    });
  });

  describe('resetPassword', () => {
    it('should reset password successfully', async () => {
      const token = 'reset_token';
      const newPassword = 'newpassword123';
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      const mockUser = {
        _id: 'user_id',
        email: 'test@example.com',
      };

      mockUsersService.findByPasswordResetToken.mockResolvedValue(mockUser);
      mockUsersService.updatePassword.mockResolvedValue(undefined);
      mockUsersService.clearPasswordResetToken.mockResolvedValue(undefined);

      const result = await service.resetPassword(token, newPassword);

      expect(result).toEqual({ message: 'Password reset successful' });
      expect(mockUsersService.findByPasswordResetToken).toHaveBeenCalledWith(token);
      expect(mockUsersService.updatePassword).toHaveBeenCalledWith('user_id', hashedPassword);
      expect(mockUsersService.clearPasswordResetToken).toHaveBeenCalledWith('user_id');
    });

    it('should throw BadRequestException for invalid token', async () => {
      const token = 'invalid_token';
      const newPassword = 'newpassword123';

      mockUsersService.findByPasswordResetToken.mockImplementation(() => {
        throw new NotFoundException('Invalid or expired reset token');
      });

      await expect(service.resetPassword(token, newPassword)).rejects.toThrow(BadRequestException);
    });
  });

  describe('verifyEmail', () => {
    it('should verify email successfully', async () => {
      const token = 'verification_token';
      const mockUser = {
        _id: 'user_id',
        email: 'test@example.com',
      };

      mockUsersService.findByEmailVerificationToken.mockResolvedValue(mockUser);
      mockUsersService.verifyEmail.mockResolvedValue(undefined);

      const result = await service.verifyEmail(token);

      expect(result).toEqual({ message: 'Email verified successfully' });
      expect(mockUsersService.findByEmailVerificationToken).toHaveBeenCalledWith(token);
      expect(mockUsersService.verifyEmail).toHaveBeenCalledWith('user_id');
    });

    it('should throw BadRequestException for invalid token', async () => {
      const token = 'invalid_token';

      mockUsersService.findByEmailVerificationToken.mockImplementation(() => {
        throw new NotFoundException('Invalid verification token');
      });

      await expect(service.verifyEmail(token)).rejects.toThrow(BadRequestException);
    });
  });

  describe('resendVerification', () => {
    it('should resend verification email successfully', async () => {
      const email = 'test@example.com';
      const mockUser = {
        _id: 'user_id',
        email,
        emailVerified: false,
      };

      mockUsersService.findByEmail.mockResolvedValue(mockUser);
      mockUsersService.setEmailVerificationToken.mockResolvedValue(undefined);

      const result = await service.resendVerification(email);

      expect(result).toEqual({ message: 'Verification email resent' });
      expect(mockUsersService.findByEmail).toHaveBeenCalledWith(email);
      expect(mockUsersService.setEmailVerificationToken).toHaveBeenCalledWith('user_id', expect.any(String));
    });

    it('should throw NotFoundException for non-existent user', async () => {
      const email = 'nonexistent@example.com';

      mockUsersService.findByEmail.mockResolvedValue(null);

      await expect(service.resendVerification(email)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException for already verified email', async () => {
      const email = 'test@example.com';
      const mockUser = {
        _id: 'user_id',
        email,
        emailVerified: true,
      };

      mockUsersService.findByEmail.mockResolvedValue(mockUser);

      await expect(service.resendVerification(email)).rejects.toThrow(BadRequestException);
    });
  });
});
