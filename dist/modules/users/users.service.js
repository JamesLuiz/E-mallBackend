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
const follow_schema_1 = require("./schemas/follow.schema");
const minio_service_1 = require("../minio/minio.service");
const user_role_enum_1 = require("../../common/enums/user-role.enum");
let UsersService = class UsersService {
    constructor(userModel, followModel, minioService) {
        this.userModel = userModel;
        this.followModel = followModel;
        this.minioService = minioService;
    }
    async create(createUserDto) {
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
        const createdUser = new this.userModel({
            email: createUserDto.email,
            password: hashedPassword,
            roles: createUserDto.roles || [user_role_enum_1.UserRole.CUSTOMER],
            profile: {
                firstName: createUserDto.firstName,
                lastName: createUserDto.lastName,
                phone: createUserDto.phone,
            },
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
        const { uri } = await this.minioService.uploadFile(file, 'avatars');
        const updatedUser = await this.userModel
            .findByIdAndUpdate(userId, { avatar: uri }, { new: true })
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
    async followUser(followerId, followDto) {
        const { userId: followingId } = followDto;
        const userToFollow = await this.userModel.findById(followingId);
        if (!userToFollow) {
            throw new common_1.NotFoundException('User to follow not found');
        }
        const existingFollow = await this.followModel.findOne({
            followerId: new mongoose_2.Types.ObjectId(followerId),
            followingId: new mongoose_2.Types.ObjectId(followingId)
        });
        if (existingFollow) {
            throw new common_1.BadRequestException('Already following this user');
        }
        const follow = new this.followModel({
            followerId: new mongoose_2.Types.ObjectId(followerId),
            followingId: new mongoose_2.Types.ObjectId(followingId)
        });
        await follow.save();
        await this.userModel.findByIdAndUpdate(followerId, { $inc: { followingCount: 1 } });
        await this.userModel.findByIdAndUpdate(followingId, { $inc: { followersCount: 1 } });
        return { message: 'Successfully followed user', follow };
    }
    async unfollowUser(followerId, followingId) {
        const follow = await this.followModel.findOneAndDelete({
            followerId: new mongoose_2.Types.ObjectId(followerId),
            followingId: new mongoose_2.Types.ObjectId(followingId)
        });
        if (!follow) {
            throw new common_1.BadRequestException('Not following this user');
        }
        await this.userModel.findByIdAndUpdate(followerId, { $inc: { followingCount: -1 } });
        await this.userModel.findByIdAndUpdate(followingId, { $inc: { followersCount: -1 } });
        return { message: 'Successfully unfollowed user' };
    }
    async getFollowers(userId, page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const followers = await this.followModel
            .find({ followingId: new mongoose_2.Types.ObjectId(userId) })
            .populate('followerId', 'firstName lastName email avatar')
            .sort({ followedAt: -1 })
            .skip(skip)
            .limit(limit)
            .exec();
        const totalFollowers = await this.followModel.countDocuments({
            followingId: new mongoose_2.Types.ObjectId(userId)
        });
        return {
            followers,
            totalFollowers,
            page,
            totalPages: Math.ceil(totalFollowers / limit)
        };
    }
    async getFollowing(userId, page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const following = await this.followModel
            .find({ followerId: new mongoose_2.Types.ObjectId(userId) })
            .populate('followingId', 'firstName lastName email avatar')
            .sort({ followedAt: -1 })
            .skip(skip)
            .limit(limit)
            .exec();
        const totalFollowing = await this.followModel.countDocuments({
            followerId: new mongoose_2.Types.ObjectId(userId)
        });
        return {
            following,
            totalFollowing,
            page,
            totalPages: Math.ceil(totalFollowing / limit)
        };
    }
    async isFollowing(followerId, followingId) {
        const follow = await this.followModel.findOne({
            followerId: new mongoose_2.Types.ObjectId(followerId),
            followingId: new mongoose_2.Types.ObjectId(followingId)
        });
        return !!follow;
    }
    async getFollowSuggestions(userId, limit = 10) {
        const following = await this.followModel.find({
            followerId: new mongoose_2.Types.ObjectId(userId)
        }).select('followingId');
        const followingIds = following.map(f => f.followingId);
        followingIds.push(new mongoose_2.Types.ObjectId(userId));
        const suggestions = await this.userModel
            .find({
            _id: { $nin: followingIds },
            isActive: true
        })
            .select('firstName lastName email avatar followersCount')
            .sort({ followersCount: -1 })
            .limit(limit)
            .exec();
        return suggestions;
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __param(1, (0, mongoose_1.InjectModel)(follow_schema_1.Follow.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        minio_service_1.MinioService])
], UsersService);
//# sourceMappingURL=users.service.js.map