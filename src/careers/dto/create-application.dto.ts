import { IsString } from 'class-validator';

export class CreateApplicationDto {
  @IsString()
  jobId: string;

  @IsString()
  applicantId: string;

  @IsString()
  coverLetter: string;

  @IsString()
  resume: string;
}