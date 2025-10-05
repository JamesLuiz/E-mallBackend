import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { VendorsService } from '../vendors/vendors.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterCustomerDto } from './dto/register-customer.dto';
import { RegisterVendorDto } from '../vendors/dto/register-vendor.dto';
import { GoogleAuthDto } from './dto/google-auth.dto';
export declare class AuthService {
    private usersService;
    private jwtService;
    private vendorsService;
    private configService;
    private googleClient;
    constructor(usersService: UsersService, jwtService: JwtService, vendorsService: VendorsService, configService: ConfigService);
    validateUser(email: string, password: string): Promise<any>;
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
    register(createUserDto: CreateUserDto): Promise<any>;
    registerCustomer(dto: RegisterCustomerDto): Promise<any>;
    registerVendor(dto: RegisterVendorDto): Promise<any>;
    private verifyGoogleIdToken;
    googleSignInCustomer(dto: GoogleAuthDto): Promise<{
        access_token: string;
        refresh_token: string;
        user: any;
    }>;
    googleSignInVendor(dto: GoogleAuthDto, vendorDetails: {
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
    refreshToken(token: string): Promise<{
        access_token: string;
    }>;
    logout(userId: string): Promise<{
        message: string;
    }>;
    forgotPassword(email: string): Promise<{
        message: string;
    }>;
    resetPassword(token: string, newPassword: string): Promise<{
        message: string;
    }>;
    verifyEmail(token: string): Promise<{
        message: string;
    }>;
    resendVerification(email: string): Promise<{
        message: string;
    }>;
    googleAuth(): Promise<{
        url: string;
    }>;
    getPublicConfig(): {
        googleClientId: string;
    };
    googleAuthCallback(code: string, state?: string): Promise<{
        access_token: string;
        refresh_token: string;
        user: any;
        isNewUser: boolean;
        message: string;
    }>;
}
