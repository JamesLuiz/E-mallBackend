import { IsString, IsArray, IsOptional } from 'class-validator';

export class CreateJobDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsArray()
  @IsString({ each: true })
  requirements: string[];

  @IsString()
  location: string;

  @IsString()
  type: string;

  @IsOptional()
  @IsString()
  salary?: string;
}