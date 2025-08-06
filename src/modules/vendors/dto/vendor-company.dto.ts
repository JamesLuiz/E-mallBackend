import { IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class BankDetailsDto {
  @IsString()
  accountName: string;

  @IsString()
  accountNumber: string;

  @IsString()
  bankName: string;

  @IsString()
  bankCode: string;
}

export class VendorCompanyDto {
  @ValidateNested()
  @Type(() => BankDetailsDto)
  bankDetails: BankDetailsDto;
}