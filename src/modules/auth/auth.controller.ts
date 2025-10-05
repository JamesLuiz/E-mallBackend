import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  Get,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';
import { Res } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RegisterDto } from './dto/register.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { ResendVerificationDto } from './dto/resend-verification.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { RegisterCustomerDto } from './dto/register-customer.dto';
import { RegisterVendorDto } from '../vendors/dto/register-vendor.dto';
import { GoogleAuthDto } from './dto/google-auth.dto';
import { Public } from '../../common/decorators/public.decorator';
import { AuthRateLimitGuard } from '../../common/guards/auth-rate-limit.guard';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @Public()
  @UseGuards(AuthRateLimitGuard)
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 409, description: 'User already exists' })
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('register/customer')
  @Public()
  @UseGuards(AuthRateLimitGuard)
  @ApiOperation({ summary: 'Register a new customer' })
  @ApiResponse({ status: 201, description: 'Customer registered successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 409, description: 'Customer already exists' })
  registerCustomer(@Body() dto: RegisterCustomerDto) {
    return this.authService.registerCustomer(dto);
  }

  @Post('register/vendor')
  @Public()
  @UseGuards(AuthRateLimitGuard)
  @ApiOperation({ summary: 'Register a new vendor' })
  @ApiResponse({ status: 201, description: 'Vendor registered successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 409, description: 'Vendor already exists' })
  registerVendor(@Body() dto: RegisterVendorDto) {
    return this.authService.registerVendor(dto);
  }

  @Post('login')
  @Public()
  @UseGuards(AuthRateLimitGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @ApiResponse({ status: 429, description: 'Too many login attempts' })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('google/customer')
  @Public()
  @UseGuards(AuthRateLimitGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Google sign-in for customer (ID token)' })
  @ApiResponse({ status: 200, description: 'Google sign-in successful' })
  @ApiResponse({ status: 401, description: 'Invalid Google token' })
  googleCustomer(@Body() dto: GoogleAuthDto) {
    return this.authService.googleSignInCustomer(dto);
  }

  @Post('google/vendor')
  @Public()
  @UseGuards(AuthRateLimitGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Google sign-in for vendor (ID token + vendor details)' })
  @ApiResponse({ status: 200, description: 'Google vendor sign-in successful' })
  @ApiResponse({ status: 401, description: 'Invalid Google token' })
  googleVendor(
    @Body() body: GoogleAuthDto & { businessName: string; businessPhoneNumber?: string; businessAddress?: string; businessCategory?: string; fullName?: string }
  ) {
    const { idToken, ...vendorDetails } = body;
    return this.authService.googleSignInVendor({ idToken }, vendorDetails);
  }

  @Post('refresh-token')
  @Public()
  @UseGuards(AuthRateLimitGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({ status: 200, description: 'Token refreshed successfully' })
  @ApiResponse({ status: 401, description: 'Invalid refresh token' })
  refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto.refresh_token);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout user' })
  @ApiResponse({ status: 200, description: 'Logged out successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  logout(@CurrentUser('_id') userId: string) {
    return this.authService.logout(userId);
  }

  @Post('forgot-password')
  @Public()
  @UseGuards(AuthRateLimitGuard)
  @ApiOperation({ summary: 'Send password reset email' })
  @ApiResponse({ status: 200, description: 'Password reset email sent' })
  @ApiResponse({ status: 404, description: 'User not found' })
  forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto.email);
  }

  @Post('reset-password')
  @Public()
  @UseGuards(AuthRateLimitGuard)
  @ApiOperation({ summary: 'Reset password' })
  @ApiResponse({ status: 200, description: 'Password reset successful' })
  @ApiResponse({ status: 400, description: 'Invalid or expired token' })
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto.token, resetPasswordDto.newPassword);
  }

  @Post('verify-email')
  @Public()
  @UseGuards(AuthRateLimitGuard)
  @ApiOperation({ summary: 'Verify email' })
  @ApiResponse({ status: 200, description: 'Email verified successfully' })
  @ApiResponse({ status: 400, description: 'Invalid or expired token' })
  verifyEmail(@Body() verifyEmailDto: VerifyEmailDto) {
    return this.authService.verifyEmail(verifyEmailDto.token);
  }

  @Post('resend-verification')
  @Public()
  @UseGuards(AuthRateLimitGuard)
  @ApiOperation({ summary: 'Resend verification email' })
  @ApiResponse({ status: 200, description: 'Verification email resent' })
  @ApiResponse({ status: 400, description: 'Email already verified' })
  @ApiResponse({ status: 404, description: 'User not found' })
  resendVerification(@Body() resendVerificationDto: ResendVerificationDto) {
    return this.authService.resendVerification(resendVerificationDto.email);
  }

  // Google OAuth endpoints
  @Get('google')
  @Public()
  @ApiOperation({ summary: 'Google OAuth login - redirects to Google' })
  @ApiResponse({ status: 200, description: 'Google OAuth URL generated' })
  googleAuth() {
    return this.authService.googleAuth();
  }

  @Get('config')
  @Public()
  @ApiOperation({ summary: 'Get auth configuration (public values like Google client id)' })
  @ApiResponse({ status: 200, description: 'Auth configuration' })
  getConfig() {
    return this.authService.getPublicConfig();
  }

  @Get('google/callback')
  @Public()
  @ApiOperation({ summary: 'Google OAuth callback endpoint' })
  @ApiResponse({ status: 200, description: 'Google OAuth callback processed successfully' })
  @ApiResponse({ status: 401, description: 'Google authentication failed' })
  async googleAuthCallback(
    @Query('code') code: string,
    @Query('state') state?: string,
    @Res() res?: Response,
  ) {
    if (!code) {
      throw new BadRequestException('Authorization code is required');
    }
    const result = await this.authService.googleAuthCallback(code, state);

    // If a FRONTEND_URL is configured, redirect with tokens to the frontend callback route
    const frontendUrl = (this as any).authService['configService']?.get?.('FRONTEND_URL') || process.env.FRONTEND_URL;
    if (frontendUrl && res) {
      const redirectUrl = new URL('/auth/callback', frontendUrl);
      redirectUrl.searchParams.set('access_token', result.access_token);
      redirectUrl.searchParams.set('refresh_token', result.refresh_token);
      redirectUrl.searchParams.set('is_new', String(!!result.isNewUser));
      return res.redirect(302, redirectUrl.toString());
    }

    // Fallback: return JSON (useful for API clients)
    return result;
  }
}