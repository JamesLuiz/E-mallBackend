import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type VendorDocument = Vendor & Document;

@Schema()
export class StoreSettings {
  @Prop()
  logo: string;

  // New Pinata IPFS fields for logo
  @Prop()
  logoUri: string;

  @Prop()
  logoHash: string;

  @Prop()
  banner: string;

  // New Pinata IPFS fields for banner
  @Prop()
  bannerUri: string;

  @Prop()
  bannerHash: string;

  @Prop({ default: '#40F99B' })
  primaryColor: string;

  @Prop()
  description: string;

  @Prop({ type: Object })
  socialLinks: Record<string, string>;
}

@Schema()
export class VendorKycDocuments {
  @Prop({ enum: ['passport', 'national_id', 'drivers_license'] })
  identityDocumentType: string;

  @Prop()
  identityDocumentUri: string;

  @Prop()
  identityDocumentHash: string;

  @Prop()
  businessCertificateUri: string;

  @Prop()
  businessCertificateHash: string;

  @Prop()
  taxCertificateUri: string;

  @Prop()
  taxCertificateHash: string;

  @Prop()
  bankStatementUri: string;

  @Prop()
  bankStatementHash: string;

  @Prop({ default: 'pending' })
  verificationStatus: 'pending' | 'approved' | 'rejected';

  @Prop()
  verificationNotes: string;

  @Prop({ default: Date.now })
  submittedAt: Date;

  @Prop()
  verifiedAt: Date;

  @Prop()
  verifiedBy: string; // Admin user ID who verified
}

@Schema()
export class Subscription {
  @Prop({ default: 'basic' })
  plan: string;

  @Prop({ default: 'active' })
  status: string;

  @Prop({ default: Date.now })
  startDate: Date;

  @Prop()
  endDate: Date;

  @Prop({ default: 10000 })
  amount: number;
}

@Schema({ timestamps: true })
export class Vendor {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  businessName: string;

  @Prop()
  contactFullName: string;

  @Prop()
  businessPhoneNumber: string;

  @Prop()
  businessDescription: string;

  @Prop()
  businessAddress: string;

  @Prop({ enum: ['electronics', 'fashion_and_style', 'home_and_garden', 'beauty_and_health', 'sports_and_fitness', 'books_and_media'] })
  businessCategory: string;

  @Prop({ type: StoreSettings })
  storeSettings: StoreSettings;

  @Prop({ type: VendorKycDocuments })
  kycDocuments: VendorKycDocuments;

  @Prop({ type: Subscription })
  subscription: Subscription;

  @Prop({ default: false })
  verified: boolean;

  @Prop({ default: 0 })
  rating: number;

  @Prop({ default: 0 })
  totalSales: number;
}

export const VendorSchema = SchemaFactory.createForClass(Vendor);