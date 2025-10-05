"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const common_2 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_service_1 = require("./auth.service");
const login_dto_1 = require("./dto/login.dto");
const refresh_token_dto_1 = require("./dto/refresh-token.dto");
const register_dto_1 = require("./dto/register.dto");
const forgot_password_dto_1 = require("./dto/forgot-password.dto");
const reset_password_dto_1 = require("./dto/reset-password.dto");
const verify_email_dto_1 = require("./dto/verify-email.dto");
const resend_verification_dto_1 = require("./dto/resend-verification.dto");
const jwt_auth_guard_1 = require("./guards/jwt-auth.guard");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const register_customer_dto_1 = require("./dto/register-customer.dto");
const register_vendor_dto_1 = require("../vendors/dto/register-vendor.dto");
const google_auth_dto_1 = require("./dto/google-auth.dto");
const public_decorator_1 = require("../../common/decorators/public.decorator");
const auth_rate_limit_guard_1 = require("../../common/guards/auth-rate-limit.guard");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    register(registerDto) {
        return this.authService.register(registerDto);
    }
    registerCustomer(dto) {
        return this.authService.registerCustomer(dto);
    }
    registerVendor(dto) {
        return this.authService.registerVendor(dto);
    }
    login(loginDto) {
        return this.authService.login(loginDto);
    }
    googleCustomer(dto) {
        return this.authService.googleSignInCustomer(dto);
    }
    googleVendor(body) {
        const { idToken, ...vendorDetails } = body;
        return this.authService.googleSignInVendor({ idToken }, vendorDetails);
    }
    refreshToken(refreshTokenDto) {
        return this.authService.refreshToken(refreshTokenDto.refresh_token);
    }
    logout(userId) {
        return this.authService.logout(userId);
    }
    forgotPassword(forgotPasswordDto) {
        return this.authService.forgotPassword(forgotPasswordDto.email);
    }
    resetPassword(resetPasswordDto) {
        return this.authService.resetPassword(resetPasswordDto.token, resetPasswordDto.newPassword);
    }
    verifyEmail(verifyEmailDto) {
        return this.authService.verifyEmail(verifyEmailDto.token);
    }
    resendVerification(resendVerificationDto) {
        return this.authService.resendVerification(resendVerificationDto.email);
    }
    googleAuth() {
        return this.authService.googleAuth();
    }
    getConfig() {
        return this.authService.getPublicConfig();
    }
    async googleAuthCallback(code, state, res) {
        if (!code) {
            throw new common_1.BadRequestException('Authorization code is required');
        }
        const result = await this.authService.googleAuthCallback(code, state);
        const frontendUrl = this.authService['configService']?.get?.('FRONTEND_URL') || process.env.FRONTEND_URL;
        if (frontendUrl && res) {
            const redirectUrl = new URL('/auth/callback', frontendUrl);
            redirectUrl.searchParams.set('access_token', result.access_token);
            redirectUrl.searchParams.set('refresh_token', result.refresh_token);
            redirectUrl.searchParams.set('is_new', String(!!result.isNewUser));
            return res.redirect(302, redirectUrl.toString());
        }
        return result;
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('register'),
    (0, public_decorator_1.Public)(),
    (0, common_1.UseGuards)(auth_rate_limit_guard_1.AuthRateLimitGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Register a new user' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'User registered successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid input data' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'User already exists' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_dto_1.RegisterDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('register/customer'),
    (0, public_decorator_1.Public)(),
    (0, common_1.UseGuards)(auth_rate_limit_guard_1.AuthRateLimitGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Register a new customer' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Customer registered successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid input data' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Customer already exists' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_customer_dto_1.RegisterCustomerDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "registerCustomer", null);
__decorate([
    (0, common_1.Post)('register/vendor'),
    (0, public_decorator_1.Public)(),
    (0, common_1.UseGuards)(auth_rate_limit_guard_1.AuthRateLimitGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Register a new vendor' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Vendor registered successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid input data' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Vendor already exists' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_vendor_dto_1.RegisterVendorDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "registerVendor", null);
__decorate([
    (0, common_1.Post)('login'),
    (0, public_decorator_1.Public)(),
    (0, common_1.UseGuards)(auth_rate_limit_guard_1.AuthRateLimitGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Login user' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Login successful' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Invalid credentials' }),
    (0, swagger_1.ApiResponse)({ status: 429, description: 'Too many login attempts' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('google/customer'),
    (0, public_decorator_1.Public)(),
    (0, common_1.UseGuards)(auth_rate_limit_guard_1.AuthRateLimitGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Google sign-in for customer (ID token)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Google sign-in successful' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Invalid Google token' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [google_auth_dto_1.GoogleAuthDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "googleCustomer", null);
__decorate([
    (0, common_1.Post)('google/vendor'),
    (0, public_decorator_1.Public)(),
    (0, common_1.UseGuards)(auth_rate_limit_guard_1.AuthRateLimitGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Google sign-in for vendor (ID token + vendor details)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Google vendor sign-in successful' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Invalid Google token' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "googleVendor", null);
__decorate([
    (0, common_1.Post)('refresh-token'),
    (0, public_decorator_1.Public)(),
    (0, common_1.UseGuards)(auth_rate_limit_guard_1.AuthRateLimitGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Refresh access token' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Token refreshed successfully' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Invalid refresh token' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [refresh_token_dto_1.RefreshTokenDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "refreshToken", null);
__decorate([
    (0, common_1.Post)('logout'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Logout user' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Logged out successfully' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "logout", null);
__decorate([
    (0, common_1.Post)('forgot-password'),
    (0, public_decorator_1.Public)(),
    (0, common_1.UseGuards)(auth_rate_limit_guard_1.AuthRateLimitGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Send password reset email' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Password reset email sent' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [forgot_password_dto_1.ForgotPasswordDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "forgotPassword", null);
__decorate([
    (0, common_1.Post)('reset-password'),
    (0, public_decorator_1.Public)(),
    (0, common_1.UseGuards)(auth_rate_limit_guard_1.AuthRateLimitGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Reset password' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Password reset successful' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid or expired token' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [reset_password_dto_1.ResetPasswordDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "resetPassword", null);
__decorate([
    (0, common_1.Post)('verify-email'),
    (0, public_decorator_1.Public)(),
    (0, common_1.UseGuards)(auth_rate_limit_guard_1.AuthRateLimitGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Verify email' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Email verified successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid or expired token' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [verify_email_dto_1.VerifyEmailDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "verifyEmail", null);
__decorate([
    (0, common_1.Post)('resend-verification'),
    (0, public_decorator_1.Public)(),
    (0, common_1.UseGuards)(auth_rate_limit_guard_1.AuthRateLimitGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Resend verification email' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Verification email resent' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Email already verified' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [resend_verification_dto_1.ResendVerificationDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "resendVerification", null);
__decorate([
    (0, common_1.Get)('google'),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Google OAuth login - redirects to Google' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Google OAuth URL generated' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "googleAuth", null);
__decorate([
    (0, common_1.Get)('config'),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get auth configuration (public values like Google client id)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Auth configuration' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "getConfig", null);
__decorate([
    (0, common_1.Get)('google/callback'),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Google OAuth callback endpoint' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Google OAuth callback processed successfully' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Google authentication failed' }),
    __param(0, (0, common_1.Query)('code')),
    __param(1, (0, common_1.Query)('state')),
    __param(2, (0, common_2.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "googleAuthCallback", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('Authentication'),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map