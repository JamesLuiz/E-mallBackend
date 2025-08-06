import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class NotificationFilterDto {
  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsBoolean()
  read?: boolean;
}