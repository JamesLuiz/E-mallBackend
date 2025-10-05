import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GoogleAuthDto {
  @ApiProperty({ 
    description: 'Google ID token from client',
    example: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...'
  })
  @IsString({ message: 'ID token must be a string' })
  @IsNotEmpty({ message: 'ID token is required' })
  idToken: string;
}

