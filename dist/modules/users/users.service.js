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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const bcrypt = require("bcrypt");
const user_schema_1 = require("./schemas/user.schema");
let UsersService = class UsersService {
    constructor(userModel) {
        this.userModel = userModel;
    }
    async create(createUserDto) {
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
        const createdUser = new this.userModel({
            ...createUserDto,
            password: hashedPassword,
        });
        return createdUser.save();
    }
    async findAll() {
        return this.userModel.find({ isActive: true }).select('-password').exec();
    }
    async findOne(id) {
        const user = await this.userModel.findById(id).select('-password').exec();
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return user;
    }
    async findByEmail(email) {
        return this.userModel.findOne({ email }).exec();
    }
    async findOneDocument(id) {
        const user = await this.userModel.findById(id).exec();
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return user;
    }
    async updateProfile(id, updateProfileDto) {
        const updatedUser = await this.userModel
            .findByIdAndUpdate(id, { $set: { profile: updateProfileDto } }, { new: true, runValidators: true })
            .select('-password')
            .exec();
        if (!updatedUser) {
            throw new common_1.NotFoundException('User not found');
        }
        return updatedUser;
    }
    async uploadAvatar(userId, file) {
        const avatarUrl = `uploads/avatars/${file.filename || file.originalname}`;
        const updatedUser = await this.userModel
            .findByIdAndUpdate(userId, { avatar: avatarUrl }, { new: true })
            .select('-password')
            .exec();
        if (!updatedUser) {
            throw new common_1.NotFoundException('User not found');
        }
        return updatedUser;
    }
    async updateProfilePicture(userId, uploadResult) {
        const updatedUser = await this.userModel
            .findByIdAndUpdate(userId, {
            $set: {
                'profile.avatarUri': uploadResult.uri,
                'profile.avatarHash': uploadResult.hash,
                'profile.avatar': uploadResult.uri,
            },
        }, { new: true, runValidators: true })
            .select('-password')
            .exec();
        if (!updatedUser) {
            throw new common_1.NotFoundException('User not found');
        }
        return updatedUser;
    }
    async uploadKycDocuments(userId, documentType, uploadResult) {
        const updateData = {
            'kycDocuments.submittedAt': new Date(),
            'kycDocuments.verificationStatus': 'pending',
        };
        if (documentType === 'identity') {
            updateData['kycDocuments.identityDocumentUri'] = uploadResult.uri;
            updateData['kycDocuments.identityDocumentHash'] = uploadResult.hash;
        }
        else if (documentType === 'proofOfAddress') {
            updateData['kycDocuments.proofOfAddressUri'] = uploadResult.uri;
            updateData['kycDocuments.proofOfAddressHash'] = uploadResult.hash;
        }
        const updatedUser = await this.userModel
            .findByIdAndUpdate(userId, { $set: updateData }, { new: true, runValidators: true })
            .select('-password')
            .exec();
        if (!updatedUser) {
            throw new common_1.NotFoundException('User not found');
        }
        return updatedUser;
    }
    async updateKycDocumentType(userId, documentType) {
        const updatedUser = await this.userModel
            .findByIdAndUpdate(userId, { $set: { 'kycDocuments.identityDocumentType': documentType } }, { new: true, runValidators: true })
            .select('-password')
            .exec();
        if (!updatedUser) {
            throw new common_1.NotFoundException('User not found');
        }
        return updatedUser;
    }
    async updateKycVerificationStatus(userId, status, notes) {
        const updateData = {
            'kycDocuments.verificationStatus': status,
            'kycDocuments.verificationNotes': notes,
        };
        if (status === 'approved' || status === 'rejected') {
            updateData['kycDocuments.verifiedAt'] = new Date();
        }
        const updatedUser = await this.userModel
            .findByIdAndUpdate(userId, { $set: updateData }, { new: true, runValidators: true })
            .select('-password')
            .exec();
        if (!updatedUser) {
            throw new common_1.NotFoundException('User not found');
        }
        return updatedUser;
    }
    async getKycStatus(userId) {
        const user = await this.userModel.findById(userId).select('kycDocuments').exec();
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return user.kycDocuments || null;
    }
    async setPasswordResetToken(userId, token) {
        await this.userModel.findByIdAndUpdate(userId, {
            passwordResetToken: token,
            passwordResetExpires: new Date(Date.now() + 3600000)
        }).exec();
    }
    async findByPasswordResetToken(token) {
        const user = await this.userModel.findOne({
            passwordResetToken: token,
            passwordResetExpires: { $gt: new Date() }
        }).exec();
        if (!user) {
            throw new common_1.NotFoundException('Invalid or expired reset token');
        }
        return user;
    }
    async updatePassword(userId, hashedPassword) {
        await this.userModel.findByIdAndUpdate(userId, {
            password: hashedPassword
        }).exec();
    }
    async clearPasswordResetToken(userId) {
        await this.userModel.findByIdAndUpdate(userId, {
            passwordResetToken: undefined,
            passwordResetExpires: undefined
        }).exec();
    }
    async setEmailVerificationToken(userId, token) {
        await this.userModel.findByIdAndUpdate(userId, {
            emailVerificationToken: token
        }).exec();
    }
    async findByEmailVerificationToken(token) {
        const user = await this.userModel.findOne({
            emailVerificationToken: token
        }).exec();
        if (!user) {
            throw new common_1.NotFoundException('Invalid verification token');
        }
        return user;
    }
    async verifyEmail(userId) {
        await this.userModel.findByIdAndUpdate(userId, {
            emailVerified: true,
            emailVerificationToken: undefined
        }).exec();
    }
    async changePassword(userId, dto) {
        const user = await this.userModel.findById(userId).exec();
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const isMatch = await bcrypt.compare(dto.currentPassword, user.password);
        if (!isMatch)
            throw new common_1.UnauthorizedException('Current password is incorrect');
        const hashed = await bcrypt.hash(dto.newPassword, 10);
        user.password = hashed;
        await user.save();
        return { message: 'Password changed successfully' };
    }
    async updateRefreshToken(userId, refreshToken) {
        await this.userModel.findByIdAndUpdate(userId, { refreshToken }).exec();
    }
    async remove(id) {
        const result = await this.userModel.findByIdAndUpdate(id, { isActive: false }, { new: true }).exec();
        if (!result) {
            throw new common_1.NotFoundException('User not found');
        }
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], UsersService);
//# sourceMappingURL=users.service.js.map