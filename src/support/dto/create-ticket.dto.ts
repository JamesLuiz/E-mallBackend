import { IsString, IsOptional } from 'class-validator';

export class CreateTicketDto {
  @IsString()
  userId: string;

  @IsString()
  subject: string;

  @IsString()
  message: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  priority?: string;
}