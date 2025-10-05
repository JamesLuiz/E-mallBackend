import { Injectable, UnauthorizedException, NotFoundException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { VendorsService } from '../vendors/vendors.service';
import { UserDocument } from '../users/schemas/user.schema';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { v4 as uuidv4 } from 'uuid';
import { RegisterCustomerDto } from './dto/register-customer.dto';
import { RegisterVendorDto } from '../vendors/dto/register-vendor.dto';
import { UserRole } from '../../common/enums/user-role.enum';
import { GoogleAuthDto } from './dto/google-auth.dto';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class AuthService {
  private googleClient: OAuth2Client;

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private vendorsService: VendorsService,
    private configService: ConfigService,
  ) {
    // Initialize Google OAuth client with environment variables.
    // Support both GOOGLE_CLIENT_ID and legacy CLIENT_ID naming in .env.
  const clientId = this.configService.get<string>('GOOGLE_CLIENT_ID') || this.configService.get<string>('CLIENT_ID') || process.env.GOOGLE_CLIENT_ID || process.env.CLIENT_ID;
  const clientSecret = this.configService.get<string>('GOOGLE_CLIENT_SECRET') || this.configService.get<string>('CLIENT_SECRET') || process.env.GOOGLE_CLIENT_SECRET || process.env.CLIENT_SECRET;
    const callbackUrl = this.configService.get<string>('GOOGLE_CALLBACK_URL') || this.configService.get<string>('GOOGLE_REDIRECT_URI') || this.configService.get<string>('CLIENT_CALLBACK_URL');

    if (!clientId || !clientSecret) {
      // Defer throwing; some flows may only need ID token verification path, but warn in logs
      console.warn('Google OAuth client id or secret not configured. Set GOOGLE_CLIENT_ID/CLIENT_ID and GOOGLE_CLIENT_SECRET/CLIENT_SECRET in env.');
    }

    this.googleClient = new OAuth2Client(clientId, clientSecret, callbackUrl);
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user.toObject();
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email: user.email, sub: (user as any)._id, role: (user as any).role };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    await this.usersService.updateRefreshToken((user as any)._id, refreshToken);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      user: {
        id: (user as any)._id,
        email: user.email,
        roles: user.roles,
        profile: user.profile,
      },
    };
  }

  async register(createUserDto: CreateUserDto): Promise<any> {
    const user = await this.usersService.create(createUserDto);
    const { password, ...result } = (user as any).toObject();
    return result;
  }

  async registerCustomer(dto: RegisterCustomerDto): Promise<any> {
    const user: any = await this.usersService.create({
      email: dto.email,
      password: dto.password,
      roles: [UserRole.CUSTOMER],
      firstName: dto.firstName,
      lastName: dto.lastName,
      phone: dto.phoneNumber,
    } as any);
    const { password, ...result } = (user as any).toObject();
    return result;
  }

  async registerVendor(dto: RegisterVendorDto): Promise<any> {
    const user: any = await this.usersService.create({
      email: dto.email,
      password: dto.password,
      roles: [UserRole.VENDOR],
      firstName: dto.fullName?.split(' ')[0],
      lastName: dto.fullName?.split(' ').slice(1).join(' '),
      phone: dto.businessPhoneNumber,
    } as any);

    const vendor = await this.vendorsService.create((user as any)._id.toString(), dto.businessName);
    await this.vendorsService.updateByUserId((user as any)._id.toString(), {
      contactFullName: dto.fullName,
      businessPhoneNumber: dto.businessPhoneNumber,
      businessAddress: dto.businessAddress,
      businessCategory: dto.businessCategory,
    } as any);

    const { password, ...userResult } = (user as any).toObject();
    return { user: userResult, vendor };
  }

  private async verifyGoogleIdToken(idToken: string): Promise<{ email: string; given_name?: string; family_name?: string; name?: string } | null> {
    try {
      const ticket = await this.googleClient.verifyIdToken({ 
        idToken, 
        audience: this.configService.get<string>('GOOGLE_CLIENT_ID') 
      });
      const payload = ticket.getPayload();
      if (!payload || !payload.email) return null;
      return {
        email: payload.email,
        given_name: payload.given_name,
        family_name: payload.family_name,
        name: payload.name,
      } as any;
    } catch (error) {
      console.error('Google ID token verification failed:', error);
      return null;
    }
  }

  async googleSignInCustomer(dto: GoogleAuthDto) {
    const profile = await this.verifyGoogleIdToken(dto.idToken);
    if (!profile) throw new UnauthorizedException('Invalid Google token');

    let user: any = await this.usersService.findByEmail(profile.email);
    if (!user) {
      user = await this.usersService.create({
        email: profile.email,
        password: uuidv4(),
        roles: [UserRole.CUSTOMER],
        firstName: profile.given_name || profile.name?.split(' ')[0],
        lastName: profile.family_name || profile.name?.split(' ').slice(1).join(' '),
      } as any);
    }

    const payload = { email: user.email, sub: user._id, role: user.roles };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });
    await this.usersService.updateRefreshToken(user._id.toString(), refreshToken);
    const { password, ...result } = (user as any).toObject();
    return { access_token: accessToken, refresh_token: refreshToken, user: result };
  }

  async googleSignInVendor(dto: GoogleAuthDto, vendorDetails: { businessName: string; businessPhoneNumber?: string; businessAddress?: string; businessCategory?: string; fullName?: string }) {
    const profile = await this.verifyGoogleIdToken(dto.idToken);
    if (!profile) throw new UnauthorizedException('Invalid Google token');

    let user: any = await this.usersService.findByEmail(profile.email);
    if (!user) {
      user = await this.usersService.create({
        email: profile.email,
        password: uuidv4(),
        roles: [UserRole.VENDOR],
        firstName: profile.given_name || vendorDetails.fullName?.split(' ')[0] || profile.name?.split(' ')[0],
        lastName: profile.family_name || vendorDetails.fullName?.split(' ').slice(1).join(' ') || profile.name?.split(' ').slice(1).join(' '),
        phone: vendorDetails.businessPhoneNumber,
      } as any);
    }

    // Ensure vendor record exists/updated
    let vendorRecord: any;
    try {
      vendorRecord = await this.vendorsService.findByUserId(user._id.toString());
    } catch (e) {
      vendorRecord = await this.vendorsService.create(user._id.toString(), vendorDetails.businessName);
    }
    await this.vendorsService.updateByUserId(user._id.toString(), {
      contactFullName: vendorDetails.fullName || profile.name,
      businessPhoneNumber: vendorDetails.businessPhoneNumber,
      businessAddress: vendorDetails.businessAddress,
      businessCategory: vendorDetails.businessCategory,
    } as any);

    const payload = { email: user.email, sub: user._id, role: user.roles };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });
    await this.usersService.updateRefreshToken(user._id.toString(), refreshToken);
    const { password, ...result } = (user as any).toObject();
    return { access_token: accessToken, refresh_token: refreshToken, user: result, vendor: vendorRecord };
  }

  async refreshToken(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      const user = await this.usersService.findOneDocument(payload.sub);
      const newPayload = { email: user.email, sub: user._id, roles: user.roles };
      const accessToken = this.jwtService.sign(newPayload);
      return { access_token: accessToken };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(userId: string) {
    await this.usersService.updateRefreshToken(userId, null);
    return { message: 'Logged out successfully' };
  }

  async forgotPassword(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new NotFoundException('User not found');
    const token = uuidv4();
    await this.usersService.setPasswordResetToken(user._id, token);
    // TODO: Send email with token (integration with email service)
    return { message: 'Password reset email sent' };
  }

  async resetPassword(token: string, newPassword: string) {
    const user = await this.usersService.findByPasswordResetToken(token);
    if (!user) throw new BadRequestException('Invalid or expired token');
    const hashed = await bcrypt.hash(newPassword, 10);
    await this.usersService.updatePassword(user._id, hashed);
    await this.usersService.clearPasswordResetToken(user._id);
    return { message: 'Password reset successful' };
  }

  async verifyEmail(token: string) {
    const user = await this.usersService.findByEmailVerificationToken(token);
    if (!user) throw new BadRequestException('Invalid or expired token');
    await this.usersService.verifyEmail(user._id);
    return { message: 'Email verified successfully' };
  }

  async resendVerification(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new NotFoundException('User not found');
    if (user.emailVerified) throw new BadRequestException('Email already verified');
    const token = uuidv4();
    await this.usersService.setEmailVerificationToken(user._id, token);
    // TODO: Send verification email (integration with email service)
    return { message: 'Verification email resent' };
  }

  // Google OAuth implementation
  async googleAuth() {
    const redirectUri = this.configService.get<string>('GOOGLE_CALLBACK_URL');
    if (!redirectUri) {
      // Provide a clearer error than letting Google respond with missing parameter
      throw new BadRequestException('GOOGLE_CALLBACK_URL is not configured on the server. Set GOOGLE_CALLBACK_URL env to the backend callback URL (e.g. http://localhost:3000/api/auth/google/callback)');
    }

    const authUrl = this.googleClient.generateAuthUrl({
      access_type: 'offline',
      scope: [
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile',
      ],
      redirect_uri: redirectUri,
    });
    return { url: authUrl };
  }

  // Return public configuration values safe for client consumption
  getPublicConfig() {
    const googleClientId = this.configService.get<string>('GOOGLE_CLIENT_ID') || this.configService.get<string>('CLIENT_ID');
    return { googleClientId };
  }

  async googleAuthCallback(code: string, state?: string) {
    try {
      // Exchange authorization code for tokens
      const { tokens } = await this.googleClient.getToken(code);
      this.googleClient.setCredentials(tokens);

      // Get user info from Google
      const ticket = await this.googleClient.verifyIdToken({
        idToken: tokens.id_token!,
        audience: this.configService.get<string>('GOOGLE_CLIENT_ID'),
      });
      const payload = ticket.getPayload();
      
      if (!payload || !payload.email) {
        throw new UnauthorizedException('Invalid Google token');
      }

      // Check if user exists
      let user: any = await this.usersService.findByEmail(payload.email);
      const isNewUser = !user;

      if (!user) {
        // Create new user with Google profile
        user = await this.usersService.create({
          email: payload.email,
          password: uuidv4(), // Random password for Google users
          roles: [UserRole.CUSTOMER], // Default to customer
          firstName: payload.given_name || payload.name?.split(' ')[0],
          lastName: payload.family_name || payload.name?.split(' ').slice(1).join(' '),
        } as any);
      }

      // Generate JWT tokens
      const jwtPayload = { 
        email: user.email, 
        sub: user._id, 
        roles: user.roles 
      };
      const accessToken = this.jwtService.sign(jwtPayload);
      const refreshToken = this.jwtService.sign(jwtPayload, { 
        expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN') || '7d' 
      });

      // Update refresh token
      await this.usersService.updateRefreshToken(user._id.toString(), refreshToken);

      const { password, ...userResult } = (user as any).toObject();

      return {
        access_token: accessToken,
        refresh_token: refreshToken,
        user: userResult,
        isNewUser,
        message: isNewUser ? 'Account created successfully' : 'Login successful',
      };
    } catch (error) {
      console.error('Google OAuth callback error:', error);
      throw new UnauthorizedException('Google authentication failed');
    }
  }
}