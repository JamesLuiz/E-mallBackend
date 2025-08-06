import { IsOptional, IsString, IsBoolean, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class StoreSettingsDto {
  @IsOptional()
  @IsString()
  logo?: string;

  @IsOptional()
  @IsString()
  logoUri?: string;

  @IsOptional()
  @IsString()
  logoHash?: string;

  @IsOptional()
  @IsString()
  banner?: string;

  @IsOptional()
  @IsString()
  bannerUri?: string;

  @IsOptional()
  @IsString()
  bannerHash?: string;

  @IsOptional()
  @IsString()
  primaryColor?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  socialLinks?: Record<string, string>;
}

export class UpdateVendorDto {
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