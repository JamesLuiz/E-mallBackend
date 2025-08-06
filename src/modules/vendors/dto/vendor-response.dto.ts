import { Exclude, Expose, Transform } from 'class-transformer';

export class VendorResponseDto {
  @Expose()
  id: string;

  @Expose()
  businessName: string;

  @Expose()
  businessDescription: string;

  @Expose()
  businessAddress: string;

  @Expose()
  storeSettings: {
    logo?: string;
    logoUri?: string;
    banner?: string;
    bannerUri?: string;
    primaryColor?: string;
    description?: string;
    socialLinks?: Record<string, string>;
  };

  @Expose()
  verified: boolean;

  @Expose()
  rating: number;

  @Expose()
  totalSales: number;

  @Expose()
  @Transform(({ obj }) => obj.userId?.email)
  userEmail: string;

  @Expose()
  @Transform(({ obj }) => obj.userId?.profile)
  userProfile: any;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  // Exclude sensitive information
  @Exclude()
  kycDocuments: any;

  @Exclude()
  userId: any;
}