import { IsString, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class StoreSettingsDto {
  @ApiProperty({ required: true })
  @IsString()
  logo: string;

  @ApiProperty({ required: true })
  @IsString()
  logoUri: string;

  @ApiProperty({ required: true })
  @IsString()
  logoHash: string;

  @ApiProperty({ required: true })
  @IsString()
  banner: string;

  @ApiProperty({ required: true })
  @IsString()
  bannerUri: string;

  @ApiProperty({ required: true })
  @IsString()
  bannerHash: string;

  @ApiProperty({ required: true })
  @IsString()
  primaryColor: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  socialLinks?: Record<string, string>;
}

export class CreateVendorDto {
  @ApiProperty()
  @IsString()
  businessName: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  businessDescription?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  businessAddress?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => StoreSettingsDto)
  storeSettings?: StoreSettingsDto;
}