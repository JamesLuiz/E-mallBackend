import { IsOptional, IsString } from 'class-validator';

export class UploadFileDto {
  // The file will be handled by Multer, so no decorator for image
  @IsOptional()
  @IsString()
  folder?: string;
}