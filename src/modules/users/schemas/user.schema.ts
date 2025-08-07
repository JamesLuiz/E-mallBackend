import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UserRole } from '../../../common/enums/user-role.enum';

export type UserDocument = User & Document;

@Schema()
export class Profile {
  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop()
  phone: string;

  @Prop()
  address: string;

  @Prop()
  city: string;

  @Prop()
  state: string;

  @Prop()
  avatar: string;

  // New field for Pinata IPFS URI
  @Prop()
  avatarUri: string;

  @Prop()
  avatarHash: string; // IPFS hash for potential deletion
}

@Schema()
export class KycDocuments {
  @Prop({ enum: ['passport', 'national_id', 'drivers_license'] })
  identityDocumentType: string;

  @Prop()
  identityDocumentUri: string;

  @Prop()
  identityDocumentHash: string;

  @Prop()
  proofOfAddressUri: string;

  @Prop()
  proofOfAddressHash: string;

  @Prop({ default: 'pending' })
  verificationStatus: 'pending' | 'approved' | 'rejected';

  @Prop()
  verificationNotes: string;

  @Prop({ default: Date.now })
  submittedAt: Date;

  @Prop()
  verifiedAt: Date;
}

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ enum: UserRole, default: UserRole.CUSTOMER })
  roles: UserRole[];

  @Prop({ type: Profile })
  profile: Profile;

  @Prop({ type: KycDocuments })
  kycDocuments: KycDocuments;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: false })
  emailVerified: boolean;

  @Prop()
  refreshToken?: string;

  // Password reset fields
  @Prop()
  passwordResetToken?: string;

  @Prop()
  passwordResetExpires?: Date;

  // Email verification field
  @Prop()
  emailVerificationToken?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);