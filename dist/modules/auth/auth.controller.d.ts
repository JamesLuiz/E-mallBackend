import { Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RegisterDto } from './dto/register.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { ResendVerificationDto } from './dto/resend-verification.dto';
import { RegisterCustomerDto } from './dto/register-customer.dto';
import { RegisterVendorDto } from '../vendors/dto/register-vendor.dto';
import { GoogleAuthDto } from './dto/google-auth.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<any>;
    registerCustomer(dto: RegisterCustomerDto): Promise<any>;
    registerVendor(dto: RegisterVendorDto): Promise<any>;
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        refresh_token: string;
        user: {
            id: any;
            email: any;
            roles: any;
            profile: any;
        };
    }>;
    googleCustomer(dto: GoogleAuthDto): Promise<{
        access_token: string;
        refresh_token: string;
        user: any;
    }>;
    googleVendor(body: GoogleAuthDto & {
        businessName: string;
        businessPhoneNumber?: string;
        businessAddress?: string;
        businessCategory?: string;
        fullName?: string;
    }): Promise<{
        access_token: string;
        refresh_token: string;
        user: any;
        vendor: any;
    }>;
    refreshToken(refreshTokenDto: RefreshTokenDto): Promise<{
        access_token: string;
    }>;
    logout(userId: string): Promise<{
        message: string;
    }>;
    forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<{
        message: string;
    }>;
    resetPassword(resetPasswordDto: ResetPasswordDto): Promise<{
        message: string;
    }>;
    verifyEmail(verifyEmailDto: VerifyEmailDto): Promise<{
        message: string;
    }>;
    resendVerification(resendVerificationDto: ResendVerificationDto): Promise<{
        message: string;
    }>;
    googleAuth(): Promise<{
        url: string;
    }>;
    getConfig(): {
        googleClientId: string;
    };
    googleAuthCallback(code: string, state?: string, res?: Response): Promise<void | {
        access_token: string;
        refresh_token: string;
        user: any;
        isNewUser: boolean;
        message: string;
    }>;
}
