import { Injectable, NotFoundException, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument, KycDocuments } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { FileUploadResult } from '../../common/services/pinata.service';
import { UserRole } from '../../common/enums/user-role.enum';
import { UserRole } from '../../common/enums/user-role.enum';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const createdUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
      roles: createUserDto.roles || [UserRole.CUSTOMER],
    });
    return createdUser.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find({ isActive: true }).select('-password').exec();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findById(id).select('-password').exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findByEmail(email: string): Promise<UserDocument> {
    return this.userModel.findOne({ email }).exec();
  }

  async findOneDocument(id: string): Promise<UserDocument> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async updateProfile(id: string, updateProfileDto: UpdateProfileDto): Promise<User> {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(
        id,
        { $set: { profile: updateProfileDto } },
        { new: true, runValidators: true },
      )
      .select('-password')
      .exec();

    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }
    return updatedUser;
  }

  async uploadAvatar(userId: string, file: Express.Multer.File): Promise<User> {
    // TODO: Integrate with uploads service/cloud storage
    // For now, just save the file path or buffer as avatar
    const avatarUrl = `uploads/avatars/${file.filename || file.originalname}`;
    const updatedUser = await this.userModel
      .findByIdAndUpdate(userId, { avatar: avatarUrl }, { new: true })
      .select('-password')
      .exec();
    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }
    return updatedUser;
  }

  // New method for Pinata profile picture upload
  async updateProfilePicture(userId: string, uploadResult: FileUploadResult): Promise<User> {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(
        userId,
        {
          $set: {
            'profile.avatarUri': uploadResult.uri,
            'profile.avatarHash': uploadResult.hash,
            'profile.avatar': uploadResult.uri, // Keep legacy field for backward compatibility
          },
        },
        { new: true, runValidators: true }
      )
      .select('-password')
      .exec();

    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }
    return updatedUser;
  }

  // New method for KYC document uploads
  async uploadKycDocuments(
    userId: string,
    documentType: 'identity' | 'proofOfAddress',
    uploadResult: FileUploadResult
  ): Promise<User> {
    const updateData: any = {
      'kycDocuments.submittedAt': new Date(),
      'kycDocuments.verificationStatus': 'pending',
    };

    if (documentType === 'identity') {
      updateData['kycDocuments.identityDocumentUri'] = uploadResult.uri;
      updateData['kycDocuments.identityDocumentHash'] = uploadResult.hash;
    } else if (documentType === 'proofOfAddress') {
      updateData['kycDocuments.proofOfAddressUri'] = uploadResult.uri;
      updateData['kycDocuments.proofOfAddressHash'] = uploadResult.hash;
    }

    const updatedUser = await this.userModel
      .findByIdAndUpdate(
        userId,
        { $set: updateData },
        { new: true, runValidators: true }
      )
      .select('-password')
      .exec();

    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }
    return updatedUser;
  }

  async updateKycDocumentType(userId: string, documentType: string): Promise<User> {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(
        userId,
        { $set: { 'kycDocuments.identityDocumentType': documentType } },
        { new: true, runValidators: true }
      )
      .select('-password')
      .exec();

    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }
    return updatedUser;
  }

  async updateKycVerificationStatus(
    userId: string,
    status: 'pending' | 'approved' | 'rejected',
    notes?: string
  ): Promise<User> {
    const updateData: any = {
      'kycDocuments.verificationStatus': status,
      'kycDocuments.verificationNotes': notes,
    };

    if (status === 'approved' || status === 'rejected') {
      updateData['kycDocuments.verifiedAt'] = new Date();
    }

    const updatedUser = await this.userModel
      .findByIdAndUpdate(
        userId,
        { $set: updateData },
        { new: true, runValidators: true }
      )
      .select('-password')
      .exec();

    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }
    return updatedUser;
  }

  async getKycStatus(userId: string): Promise<KycDocuments | null> {
    const user = await this.userModel.findById(userId).select('kycDocuments').exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user.kycDocuments || null;
  }

  // Password reset methods
  async setPasswordResetToken(userId: string, token: string): Promise<void> {
    await this.userModel.findByIdAndUpdate(userId, { 
      passwordResetToken: token,
      passwordResetExpires: new Date(Date.now() + 3600000) // 1 hour
    }).exec();
  }

  async findByPasswordResetToken(token: string): Promise<UserDocument> {
    const user = await this.userModel.findOne({ 
      passwordResetToken: token,
      passwordResetExpires: { $gt: new Date() }
    }).exec();
    
    if (!user) {
      throw new NotFoundException('Invalid or expired reset token');
    }
    return user;
  }

  async updatePassword(userId: string, hashedPassword: string): Promise<void> {
    await this.userModel.findByIdAndUpdate(userId, { 
      password: hashedPassword 
    }).exec();
  }

  async clearPasswordResetToken(userId: string): Promise<void> {
    await this.userModel.findByIdAndUpdate(userId, { 
      passwordResetToken: undefined,
      passwordResetExpires: undefined
    }).exec();
  }

  // Email verification methods
  async setEmailVerificationToken(userId: string, token: string): Promise<void> {
    await this.userModel.findByIdAndUpdate(userId, { 
      emailVerificationToken: token 
    }).exec();
  }

  async findByEmailVerificationToken(token: string): Promise<UserDocument> {
    const user = await this.userModel.findOne({ 
      emailVerificationToken: token 
    }).exec();
    
    if (!user) {
      throw new NotFoundException('Invalid verification token');
    }
    return user;
  }

  async verifyEmail(userId: string): Promise<void> {
    await this.userModel.findByIdAndUpdate(userId, { 
      emailVerified: true,
      emailVerificationToken: undefined
    }).exec();
  }

  async changePassword(userId: string, dto: { currentPassword: string; newPassword: string }): Promise<{ message: string }> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) throw new NotFoundException('User not found');
    const isMatch = await bcrypt.compare(dto.currentPassword, user.password);
    if (!isMatch) throw new UnauthorizedException('Current password is incorrect');
    const hashed = await bcrypt.hash(dto.newPassword, 10);
    user.password = hashed;
    await user.save();
    return { message: 'Password changed successfully' };
  }

  async updateRefreshToken(userId: string, refreshToken: string): Promise<void> {
    await this.userModel.findByIdAndUpdate(userId, { refreshToken }).exec();
  }

  async remove(id: string): Promise<void> {
    const result = await this.userModel.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true },
    ).exec();
    if (!result) {
      throw new NotFoundException('User not found');
    }
  }
}