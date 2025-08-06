import { IsOptional, IsString, IsDateString } from 'class-validator';

export class AnalyticsQueryDto {
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsString()
  granularity?: string;

  @IsOptional()
  @IsString()
  vendorId?: string;
}