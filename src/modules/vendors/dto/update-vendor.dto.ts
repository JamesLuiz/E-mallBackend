import { IsOptional, IsString, IsBoolean, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class StoreSettingsDto {
  @IsString()
  logo: string;

  @IsString()
  logoUri: string;

  @IsString()
  logoHash: string;

  @IsString()
  banner: string;

  @IsString()
  bannerUri: string;

  @IsString()
  bannerHash: string;

  @IsString()
  primaryColor: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  socialLinks?: Record<string, string>;
}

export class UpdateVendorDto {
  @IsString()
  logo: string;

  @IsOptional()
  @IsString()
  businessName?: string;

  @IsOptional()
  @IsString()
  businessDescription?: string;

  @IsOptional()
  @IsString()
  businessAddress?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => StoreSettingsDto)
  storeSettings?: StoreSettingsDto;

  @IsOptional()
  @IsBoolean()
  verified?: boolean;
}