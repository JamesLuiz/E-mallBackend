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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const bcrypt = require("bcrypt");
const users_service_1 = require("../users/users.service");
const vendors_service_1 = require("../vendors/vendors.service");
const uuid_1 = require("uuid");
const user_role_enum_1 = require("../../common/enums/user-role.enum");
const google_auth_library_1 = require("google-auth-library");
let AuthService = class AuthService {
    constructor(usersService, jwtService, vendorsService, configService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.vendorsService = vendorsService;
        this.configService = configService;
        const clientId = this.configService.get('GOOGLE_CLIENT_ID') || this.configService.get('CLIENT_ID') || process.env.GOOGLE_CLIENT_ID || process.env.CLIENT_ID;
        const clientSecret = this.configService.get('GOOGLE_CLIENT_SECRET') || this.configService.get('CLIENT_SECRET') || process.env.GOOGLE_CLIENT_SECRET || process.env.CLIENT_SECRET;
        const callbackUrl = this.configService.get('GOOGLE_CALLBACK_URL') || this.configService.get('GOOGLE_REDIRECT_URI') || this.configService.get('CLIENT_CALLBACK_URL');
        if (!clientId || !clientSecret) {
            console.warn('Google OAuth client id or secret not configured. Set GOOGLE_CLIENT_ID/CLIENT_ID and GOOGLE_CLIENT_SECRET/CLIENT_SECRET in env.');
        }
        this.googleClient = new google_auth_library_1.OAuth2Client(clientId, clientSecret, callbackUrl);
    }
    async validateUser(email, password) {
        const user = await this.usersService.findByEmail(email);
        if (user && (await bcrypt.compare(password, user.password))) {
            const { password, ...result } = user.toObject();
            return result;
        }
        return null;
    }
    async login(loginDto) {
        const user = await this.validateUser(loginDto.email, loginDto.password);
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const payload = { email: user.email, sub: user._id, role: user.role };
        const accessToken = this.jwtService.sign(payload);
        const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });
        await this.usersService.updateRefreshToken(user._id, refreshToken);
        return {
            access_token: accessToken,
            refresh_token: refreshToken,
            user: {
                id: user._id,
                email: user.email,
                roles: user.roles,
                profile: user.profile,
            },
        };
    }
    async register(createUserDto) {
        const user = await this.usersService.create(createUserDto);
        const { password, ...result } = user.toObject();
        return result;
    }
    async registerCustomer(dto) {
        const user = await this.usersService.create({
            email: dto.email,
            password: dto.password,
            roles: [user_role_enum_1.UserRole.CUSTOMER],
            firstName: dto.firstName,
            lastName: dto.lastName,
            phone: dto.phoneNumber,
        });
        const { password, ...result } = user.toObject();
        return result;
    }
    async registerVendor(dto) {
        const user = await this.usersService.create({
            email: dto.email,
            password: dto.password,
            roles: [user_role_enum_1.UserRole.VENDOR],
            firstName: dto.fullName?.split(' ')[0],
            lastName: dto.fullName?.split(' ').slice(1).join(' '),
            phone: dto.businessPhoneNumber,
        });
        const vendor = await this.vendorsService.create(user._id.toString(), dto.businessName);
        await this.vendorsService.updateByUserId(user._id.toString(), {
            contactFullName: dto.fullName,
            businessPhoneNumber: dto.businessPhoneNumber,
            businessAddress: dto.businessAddress,
            businessCategory: dto.businessCategory,
        });
        const { password, ...userResult } = user.toObject();
        return { user: userResult, vendor };
    }
    async verifyGoogleIdToken(idToken) {
        try {
            const ticket = await this.googleClient.verifyIdToken({
                idToken,
                audience: this.configService.get('GOOGLE_CLIENT_ID')
            });
            const payload = ticket.getPayload();
            if (!payload || !payload.email)
                return null;
            return {
                email: payload.email,
                given_name: payload.given_name,
                family_name: payload.family_name,
                name: payload.name,
            };
        }
        catch (error) {
            console.error('Google ID token verification failed:', error);
            return null;
        }
    }
    async googleSignInCustomer(dto) {
        const profile = await this.verifyGoogleIdToken(dto.idToken);
        if (!profile)
            throw new common_1.UnauthorizedException('Invalid Google token');
        let user = await this.usersService.findByEmail(profile.email);
        if (!user) {
            user = await this.usersService.create({
                email: profile.email,
                password: (0, uuid_1.v4)(),
                roles: [user_role_enum_1.UserRole.CUSTOMER],
                firstName: profile.given_name || profile.name?.split(' ')[0],
                lastName: profile.family_name || profile.name?.split(' ').slice(1).join(' '),
            });
        }
        const payload = { email: user.email, sub: user._id, role: user.roles };
        const accessToken = this.jwtService.sign(payload);
        const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });
        await this.usersService.updateRefreshToken(user._id.toString(), refreshToken);
        const { password, ...result } = user.toObject();
        return { access_token: accessToken, refresh_token: refreshToken, user: result };
    }
    async googleSignInVendor(dto, vendorDetails) {
        const profile = await this.verifyGoogleIdToken(dto.idToken);
        if (!profile)
            throw new common_1.UnauthorizedException('Invalid Google token');
        let user = await this.usersService.findByEmail(profile.email);
        if (!user) {
            user = await this.usersService.create({
                email: profile.email,
                password: (0, uuid_1.v4)(),
                roles: [user_role_enum_1.UserRole.VENDOR],
                firstName: profile.given_name || vendorDetails.fullName?.split(' ')[0] || profile.name?.split(' ')[0],
                lastName: profile.family_name || vendorDetails.fullName?.split(' ').slice(1).join(' ') || profile.name?.split(' ').slice(1).join(' '),
                phone: vendorDetails.businessPhoneNumber,
            });
        }
        let vendorRecord;
        try {
            vendorRecord = await this.vendorsService.findByUserId(user._id.toString());
        }
        catch (e) {
            vendorRecord = await this.vendorsService.create(user._id.toString(), vendorDetails.businessName);
        }
        await this.vendorsService.updateByUserId(user._id.toString(), {
            contactFullName: vendorDetails.fullName || profile.name,
            businessPhoneNumber: vendorDetails.businessPhoneNumber,
            businessAddress: vendorDetails.businessAddress,
            businessCategory: vendorDetails.businessCategory,
        });
        const payload = { email: user.email, sub: user._id, role: user.roles };
        const accessToken = this.jwtService.sign(payload);
        const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });
        await this.usersService.updateRefreshToken(user._id.toString(), refreshToken);
        const { password, ...result } = user.toObject();
        return { access_token: accessToken, refresh_token: refreshToken, user: result, vendor: vendorRecord };
    }
    async refreshToken(token) {
        try {
            const payload = this.jwtService.verify(token);
            const user = await this.usersService.findOneDocument(payload.sub);
            const newPayload = { email: user.email, sub: user._id, roles: user.roles };
            const accessToken = this.jwtService.sign(newPayload);
            return { access_token: accessToken };
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
    }
    async logout(userId) {
        await this.usersService.updateRefreshToken(userId, null);
        return { message: 'Logged out successfully' };
    }
    async forgotPassword(email) {
        const user = await this.usersService.findByEmail(email);
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const token = (0, uuid_1.v4)();
        await this.usersService.setPasswordResetToken(user._id, token);
        return { message: 'Password reset email sent' };
    }
    async resetPassword(token, newPassword) {
        const user = await this.usersService.findByPasswordResetToken(token);
        if (!user)
            throw new common_1.BadRequestException('Invalid or expired token');
        const hashed = await bcrypt.hash(newPassword, 10);
        await this.usersService.updatePassword(user._id, hashed);
        await this.usersService.clearPasswordResetToken(user._id);
        return { message: 'Password reset successful' };
    }
    async verifyEmail(token) {
        const user = await this.usersService.findByEmailVerificationToken(token);
        if (!user)
            throw new common_1.BadRequestException('Invalid or expired token');
        await this.usersService.verifyEmail(user._id);
        return { message: 'Email verified successfully' };
    }
    async resendVerification(email) {
        const user = await this.usersService.findByEmail(email);
        if (!user)
            throw new common_1.NotFoundException('User not found');
        if (user.emailVerified)
            throw new common_1.BadRequestException('Email already verified');
        const token = (0, uuid_1.v4)();
        await this.usersService.setEmailVerificationToken(user._id, token);
        return { message: 'Verification email resent' };
    }
    async googleAuth() {
        const redirectUri = this.configService.get('GOOGLE_CALLBACK_URL');
        if (!redirectUri) {
            throw new common_1.BadRequestException('GOOGLE_CALLBACK_URL is not configured on the server. Set GOOGLE_CALLBACK_URL env to the backend callback URL (e.g. http://localhost:3000/api/auth/google/callback)');
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
    getPublicConfig() {
        const googleClientId = this.configService.get('GOOGLE_CLIENT_ID') || this.configService.get('CLIENT_ID');
        return { googleClientId };
    }
    async googleAuthCallback(code, state) {
        try {
            const { tokens } = await this.googleClient.getToken(code);
            this.googleClient.setCredentials(tokens);
            const ticket = await this.googleClient.verifyIdToken({
                idToken: tokens.id_token,
                audience: this.configService.get('GOOGLE_CLIENT_ID'),
            });
            const payload = ticket.getPayload();
            if (!payload || !payload.email) {
                throw new common_1.UnauthorizedException('Invalid Google token');
            }
            let user = await this.usersService.findByEmail(payload.email);
            const isNewUser = !user;
            if (!user) {
                user = await this.usersService.create({
                    email: payload.email,
                    password: (0, uuid_1.v4)(),
                    roles: [user_role_enum_1.UserRole.CUSTOMER],
                    firstName: payload.given_name || payload.name?.split(' ')[0],
                    lastName: payload.family_name || payload.name?.split(' ').slice(1).join(' '),
                });
            }
            const jwtPayload = {
                email: user.email,
                sub: user._id,
                roles: user.roles
            };
            const accessToken = this.jwtService.sign(jwtPayload);
            const refreshToken = this.jwtService.sign(jwtPayload, {
                expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN') || '7d'
            });
            await this.usersService.updateRefreshToken(user._id.toString(), refreshToken);
            const { password, ...userResult } = user.toObject();
            return {
                access_token: accessToken,
                refresh_token: refreshToken,
                user: userResult,
                isNewUser,
                message: isNewUser ? 'Account created successfully' : 'Login successful',
            };
        }
        catch (error) {
            console.error('Google OAuth callback error:', error);
            throw new common_1.UnauthorizedException('Google authentication failed');
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        vendors_service_1.VendorsService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map