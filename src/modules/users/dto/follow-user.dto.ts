import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FollowUserDto {
  @ApiProperty({ description: 'User ID to follow' })
  @IsString()
  @IsNotEmpty()
  userId: string;
}
