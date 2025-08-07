import { Model } from 'mongoose';
import { User, UserDocument, KycDocuments } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { FileUploadResult } from '../../common/services/pinata.service';
export declare class UsersService {
    private userModel;
    constructor(userModel: Model<UserDocument>);
    create(createUserDto: CreateUserDto): Promise<User>;
    findAll(): Promise<User[]>;
    findOne(id: string): Promise<User>;
    findByEmail(email: string): Promise<UserDocument>;
    findOneDocument(id: string): Promise<UserDocument>;
    updateProfile(id: string, updateProfileDto: UpdateProfileDto): Promise<User>;
    uploadAvatar(userId: string, file: Express.Multer.File): Promise<User>;
    updateProfilePicture(userId: string, uploadResult: FileUploadResult): Promise<User>;
    uploadKycDocuments(userId: string, documentType: 'identity' | 'proofOfAddress', uploadResult: FileUploadResult): Promise<User>;
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
}
