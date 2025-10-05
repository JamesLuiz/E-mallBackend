import { Injectable, NotFoundException, BadRequestException, UnauthorizedException, Inject, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument, KycDocuments } from './schemas/user.schema';
import { Follow, FollowDocument } from './schemas/follow.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { FollowUserDto } from './dto/follow-user.dto';
import { MinioService, MinioUploadResult } from '../minio/minio.service';
import { UserRole } from '../../common/enums/user-role.enum';


@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Follow.name) private followModel: Model<FollowDocument>,
    private minioService: MinioService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const createdUser = new this.userModel({
      email: createUserDto.email,
      password: hashedPassword,
      roles: createUserDto.roles || [UserRole.CUSTOMER],
      profile: {
        firstName: (createUserDto as any).firstName,
        lastName: (createUserDto as any).lastName,
        phone: (createUserDto as any).phone,
      },
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
    const { uri } = await this.minioService.uploadFile(file, 'avatars');
    const updatedUser = await this.userModel
      .findByIdAndUpdate(userId, { avatar: uri }, { new: true })
      .select('-password')
      .exec();
    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }
    return updatedUser;
  }

  // New method for Pinata profile picture upload
  async updateProfilePicture(userId: string, uploadResult: MinioUploadResult): Promise<User> {
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
    uploadResult: MinioUploadResult
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

  // Follow system methods
  async followUser(followerId: string, followDto: FollowUserDto) {
    const { userId: followingId } = followDto;

    // Check if user exists
    const userToFollow = await this.userModel.findById(followingId);
    if (!userToFollow) {
      throw new NotFoundException('User to follow not found');
    }

    // Check if already following
    const existingFollow = await this.followModel.findOne({
      followerId: new Types.ObjectId(followerId),
      followingId: new Types.ObjectId(followingId)
    });

    if (existingFollow) {
      throw new BadRequestException('Already following this user');
    }

    // Create follow relationship
    const follow = new this.followModel({
      followerId: new Types.ObjectId(followerId),
      followingId: new Types.ObjectId(followingId)
    });

    await follow.save();

    // Update follower and following counts
    await this.userModel.findByIdAndUpdate(followerId, { $inc: { followingCount: 1 } });
    await this.userModel.findByIdAndUpdate(followingId, { $inc: { followersCount: 1 } });

    return { message: 'Successfully followed user', follow };
  }

  async unfollowUser(followerId: string, followingId: string) {
    // Check if follow relationship exists
    const follow = await this.followModel.findOneAndDelete({
      followerId: new Types.ObjectId(followerId),
      followingId: new Types.ObjectId(followingId)
    });

    if (!follow) {
      throw new BadRequestException('Not following this user');
    }

    // Update follower and following counts
    await this.userModel.findByIdAndUpdate(followerId, { $inc: { followingCount: -1 } });
    await this.userModel.findByIdAndUpdate(followingId, { $inc: { followersCount: -1 } });

    return { message: 'Successfully unfollowed user' };
  }

  async getFollowers(userId: string, page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;
    
    const followers = await this.followModel
      .find({ followingId: new Types.ObjectId(userId) })
      .populate('followerId', 'firstName lastName email avatar')
      .sort({ followedAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();

    const totalFollowers = await this.followModel.countDocuments({
      followingId: new Types.ObjectId(userId)
    });

    return {
      followers,
      totalFollowers,
      page,
      totalPages: Math.ceil(totalFollowers / limit)
    };
  }

  async getFollowing(userId: string, page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;
    
    const following = await this.followModel
      .find({ followerId: new Types.ObjectId(userId) })
      .populate('followingId', 'firstName lastName email avatar')
      .sort({ followedAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();

    const totalFollowing = await this.followModel.countDocuments({
      followerId: new Types.ObjectId(userId)
    });

    return {
      following,
      totalFollowing,
      page,
      totalPages: Math.ceil(totalFollowing / limit)
    };
  }

  async isFollowing(followerId: string, followingId: string): Promise<boolean> {
    const follow = await this.followModel.findOne({
      followerId: new Types.ObjectId(followerId),
      followingId: new Types.ObjectId(followingId)
    });

    return !!follow;
  }

  async getFollowSuggestions(userId: string, limit: number = 10) {
    // Get users that the current user is not following
    const following = await this.followModel.find({
      followerId: new Types.ObjectId(userId)
    }).select('followingId');

    const followingIds = following.map(f => f.followingId);
    followingIds.push(new Types.ObjectId(userId)); // Exclude self

    // Get users with most followers (popular users)
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
}