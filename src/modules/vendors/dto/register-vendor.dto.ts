import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BusinessCategory } from '../../../common/enums/business-category.enum';

export class RegisterVendorDto {
  @ApiProperty()
  @IsString()
  businessName: string;

  @ApiProperty()
  @IsString()
  fullName: string;

  @ApiProperty()
  @IsString()
  businessPhoneNumber: string;

  @ApiProperty()
  @IsString()
  businessAddress: string;

  @ApiProperty({ enum: BusinessCategory })
  @IsEnum(BusinessCategory)
  businessCategory: BusinessCategory;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ required: false, description: 'If using Google OAuth, provide token' })
  @IsOptional()
  @IsString()
  googleToken?: string;
}

