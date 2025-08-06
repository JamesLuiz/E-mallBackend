import { IsString, IsOptional } from 'class-validator';

export class VendorBioDto {
  @IsOptional()
  @IsString()
  businessRegistrationNumber?: string;

  @IsOptional()
  @IsString()
  taxIdentificationNumber?: string;
}