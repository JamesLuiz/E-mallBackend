"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const auth_controller_1 = require("./auth.controller");
const auth_service_1 = require("./auth.service");
const users_service_1 = require("../users/users.service");
const vendors_service_1 = require("../vendors/vendors.service");
const jwt_1 = require("@nestjs/jwt");
describe('AuthController', () => {
    let controller;
    let authService;
    const mockAuthService = {
        login: jest.fn(),
        register: jest.fn(),
        registerCustomer: jest.fn(),
        registerVendor: jest.fn(),
        googleSignInCustomer: jest.fn(),
        googleSignInVendor: jest.fn(),
        refreshToken: jest.fn(),
        logout: jest.fn(),
        forgotPassword: jest.fn(),
        resetPassword: jest.fn(),
        verifyEmail: jest.fn(),
        resendVerification: jest.fn(),
        googleAuth: jest.fn(),
        googleAuthCallback: jest.fn(),
    };
    const mockUsersService = {
        findByEmail: jest.fn(),
        create: jest.fn(),
        updateRefreshToken: jest.fn(),
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
        const module = await testing_1.Test.createTestingModule({
            controllers: [auth_controller_1.AuthController],
            providers: [
                {
                    provide: auth_service_1.AuthService,
                    useValue: mockAuthService,
                },
                {
                    provide: users_service_1.UsersService,
                    useValue: mockUsersService,
                },
                {
                    provide: vendors_service_1.VendorsService,
                    useValue: mockVendorsService,
                },
                {
                    provide: jwt_1.JwtService,
                    useValue: mockJwtService,
                },
            ],
        }).compile();
        controller = module.get(auth_controller_1.AuthController);
        authService = module.get(auth_service_1.AuthService);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
    describe('login', () => {
        it('should login a user successfully', async () => {
            const loginDto = {
                email: 'test@example.com',
                password: 'password123',
            };
            const expectedResult = {
                access_token: 'access_token',
                refresh_token: 'refresh_token',
                user: {
                    id: 'user_id',
                    email: 'test@example.com',
                    roles: ['customer'],
                    profile: {},
                },
            };
            mockAuthService.login.mockResolvedValue(expectedResult);
            const result = await controller.login(loginDto);
            expect(result).toEqual(expectedResult);
            expect(mockAuthService.login).toHaveBeenCalledWith(loginDto);
        });
    });
    describe('register', () => {
        it('should register a new user successfully', async () => {
            const registerDto = {
                email: 'test@example.com',
                password: 'password123',
                firstName: 'John',
                lastName: 'Doe',
                phoneNumber: '+2348012345678',
            };
            const expectedResult = {
                id: 'user_id',
                email: 'test@example.com',
                firstName: 'John',
                lastName: 'Doe',
            };
            mockAuthService.register.mockResolvedValue(expectedResult);
            const result = await controller.register(registerDto);
            expect(result).toEqual(expectedResult);
            expect(mockAuthService.register).toHaveBeenCalledWith(registerDto);
        });
    });
    describe('registerCustomer', () => {
        it('should register a new customer successfully', async () => {
            const registerCustomerDto = {
                email: 'customer@example.com',
                password: 'password123',
                firstName: 'Jane',
                lastName: 'Smith',
                phoneNumber: '+2348012345678',
            };
            const expectedResult = {
                id: 'user_id',
                email: 'customer@example.com',
                firstName: 'Jane',
                lastName: 'Smith',
            };
            mockAuthService.registerCustomer.mockResolvedValue(expectedResult);
            const result = await controller.registerCustomer(registerCustomerDto);
            expect(result).toEqual(expectedResult);
            expect(mockAuthService.registerCustomer).toHaveBeenCalledWith(registerCustomerDto);
        });
    });
    describe('googleSignInCustomer', () => {
        it('should handle Google sign-in for customer successfully', async () => {
            const googleAuthDto = {
                idToken: 'google_id_token',
            };
            const expectedResult = {
                access_token: 'access_token',
                refresh_token: 'refresh_token',
                user: {
                    id: 'user_id',
                    email: 'test@example.com',
                    roles: ['customer'],
                    profile: {},
                },
            };
            mockAuthService.googleSignInCustomer.mockResolvedValue(expectedResult);
            const result = await controller.googleCustomer(googleAuthDto);
            expect(result).toEqual(expectedResult);
            expect(mockAuthService.googleSignInCustomer).toHaveBeenCalledWith(googleAuthDto);
        });
    });
    describe('refreshToken', () => {
        it('should refresh access token successfully', async () => {
            const refreshTokenDto = {
                refresh_token: 'refresh_token',
            };
            const expectedResult = {
                access_token: 'new_access_token',
            };
            mockAuthService.refreshToken.mockResolvedValue(expectedResult);
            const result = await controller.refreshToken(refreshTokenDto);
            expect(result).toEqual(expectedResult);
            expect(mockAuthService.refreshToken).toHaveBeenCalledWith(refreshTokenDto.refresh_token);
        });
    });
    describe('logout', () => {
        it('should logout user successfully', async () => {
            const userId = 'user_id';
            const expectedResult = { message: 'Logged out successfully' };
            mockAuthService.logout.mockResolvedValue(expectedResult);
            const result = await controller.logout(userId);
            expect(result).toEqual(expectedResult);
            expect(mockAuthService.logout).toHaveBeenCalledWith(userId);
        });
    });
    describe('forgotPassword', () => {
        it('should send password reset email successfully', async () => {
            const forgotPasswordDto = {
                email: 'test@example.com',
            };
            const expectedResult = { message: 'Password reset email sent' };
            mockAuthService.forgotPassword.mockResolvedValue(expectedResult);
            const result = await controller.forgotPassword(forgotPasswordDto);
            expect(result).toEqual(expectedResult);
            expect(mockAuthService.forgotPassword).toHaveBeenCalledWith(forgotPasswordDto.email);
        });
    });
    describe('resetPassword', () => {
        it('should reset password successfully', async () => {
            const resetPasswordDto = {
                token: 'reset_token',
                newPassword: 'newpassword123',
            };
            const expectedResult = { message: 'Password reset successful' };
            mockAuthService.resetPassword.mockResolvedValue(expectedResult);
            const result = await controller.resetPassword(resetPasswordDto);
            expect(result).toEqual(expectedResult);
            expect(mockAuthService.resetPassword).toHaveBeenCalledWith(resetPasswordDto.token, resetPasswordDto.newPassword);
        });
    });
    describe('verifyEmail', () => {
        it('should verify email successfully', async () => {
            const verifyEmailDto = {
                token: 'verification_token',
            };
            const expectedResult = { message: 'Email verified successfully' };
            mockAuthService.verifyEmail.mockResolvedValue(expectedResult);
            const result = await controller.verifyEmail(verifyEmailDto);
            expect(result).toEqual(expectedResult);
            expect(mockAuthService.verifyEmail).toHaveBeenCalledWith(verifyEmailDto.token);
        });
    });
    describe('resendVerification', () => {
        it('should resend verification email successfully', async () => {
            const resendVerificationDto = {
                email: 'test@example.com',
            };
            const expectedResult = { message: 'Verification email resent' };
            mockAuthService.resendVerification.mockResolvedValue(expectedResult);
            const result = await controller.resendVerification(resendVerificationDto);
            expect(result).toEqual(expectedResult);
            expect(mockAuthService.resendVerification).toHaveBeenCalledWith(resendVerificationDto.email);
        });
    });
});
//# sourceMappingURL=auth.controller.spec.js.map