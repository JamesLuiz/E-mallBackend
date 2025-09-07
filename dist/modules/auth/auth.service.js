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
const bcrypt = require("bcrypt");
const users_service_1 = require("../users/users.service");
const uuid_1 = require("uuid");
let AuthService = class AuthService {
    constructor(usersService, jwtService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
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
        return { url: 'https://accounts.google.com/o/oauth2/v2/auth?...' };
    }
    async googleAuthCallback(query) {
        return { message: 'Google OAuth callback', query };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map