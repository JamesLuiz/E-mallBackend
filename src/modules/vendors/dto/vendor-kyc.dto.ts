import { IsString, IsOptional } from 'class-validator';

export class VendorKycDto {
  // Files handled by Multer
  @IsString()
  identityDocumentType: 'passport' | 'national_id' | 'drivers_license';

  @IsOptional()
  businessCertificate?: any;
}