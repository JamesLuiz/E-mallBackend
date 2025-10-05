import { IsNotEmpty, IsString, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class MentionUserDto {
  @ApiProperty({ description: 'Article content with mentions' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ description: 'Array of user IDs to mention', type: [String] })
  @IsArray()
  @IsString({ each: true })
  mentionedUserIds: string[];
}
