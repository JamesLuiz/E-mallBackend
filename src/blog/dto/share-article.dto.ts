import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ShareArticleDto {
  @ApiProperty({ description: 'Article ID to share' })
  @IsString()
  @IsNotEmpty()
  articleId: string;
}
