import { Model, Types } from 'mongoose';
import { User, UserDocument, KycDocuments } from './schemas/user.schema';
import { Follow, FollowDocument } from './schemas/follow.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { FollowUserDto } from './dto/follow-user.dto';
import { MinioService, MinioUploadResult } from '../minio/minio.service';
export declare class UsersService {
    private userModel;
    private followModel;
    private minioService;
    constructor(userModel: Model<UserDocument>, followModel: Model<FollowDocument>, minioService: MinioService);
    create(createUserDto: CreateUserDto): Promise<User>;
    findAll(): Promise<User[]>;
    findOne(id: string): Promise<User>;
    findByEmail(email: string): Promise<UserDocument>;
    findOneDocument(id: string): Promise<UserDocument>;
    updateProfile(id: string, updateProfileDto: UpdateProfileDto): Promise<User>;
    uploadAvatar(userId: string, file: Express.Multer.File): Promise<User>;
    updateProfilePicture(userId: string, uploadResult: MinioUploadResult): Promise<User>;
    uploadKycDocuments(userId: string, documentType: 'identity' | 'proofOfAddress', uploadResult: MinioUploadResult): Promise<User>;
    updateKycDocumentType(userId: string, documentType: string): Promise<User>;
    updateKycVerificationStatus(userId: string, status: 'pending' | 'approved' | 'rejected', notes?: string): Promise<User>;
    getKycStatus(userId: string): Promise<KycDocuments | null>;
    setPasswordResetToken(userId: string, token: string): Promise<void>;
    findByPasswordResetToken(token: string): Promise<UserDocument>;
    updatePassword(userId: string, hashedPassword: string): Promise<void>;
    clearPasswordResetToken(userId: string): Promise<void>;
    setEmailVerificationToken(userId: string, token: string): Promise<void>;
    findByEmailVerificationToken(token: string): Promise<UserDocument>;
    verifyEmail(userId: string): Promise<void>;
    changePassword(userId: string, dto: {
        currentPassword: string;
        newPassword: string;
    }): Promise<{
        message: string;
    }>;
    updateRefreshToken(userId: string, refreshToken: string): Promise<void>;
    remove(id: string): Promise<void>;
    followUser(followerId: string, followDto: FollowUserDto): Promise<{
        message: string;
        follow: import("mongoose").Document<unknown, {}, FollowDocument> & Follow & import("mongoose").Document<any, any, any> & {
            _id: Types.ObjectId;
        };
    }>;
    unfollowUser(followerId: string, followingId: string): Promise<{
        message: string;
    }>;
    getFollowers(userId: string, page?: number, limit?: number): Promise<{
        followers: Omit<import("mongoose").Document<unknown, {}, FollowDocument> & Follow & import("mongoose").Document<any, any, any> & {
            _id: Types.ObjectId;
        }, never>[];
        totalFollowers: number;
        page: number;
        totalPages: number;
    }>;
    getFollowing(userId: string, page?: number, limit?: number): Promise<{
        following: Omit<import("mongoose").Document<unknown, {}, FollowDocument> & Follow & import("mongoose").Document<any, any, any> & {
            _id: Types.ObjectId;
        }, never>[];
        totalFollowing: number;
        page: number;
        totalPages: number;
    }>;
    isFollowing(followerId: string, followingId: string): Promise<boolean>;
    getFollowSuggestions(userId: string, limit?: number): Promise<(import("mongoose").Document<unknown, {}, UserDocument> & User & import("mongoose").Document<any, any, any> & {
        _id: Types.ObjectId;
    })[]>;
}
