import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LikeArticleDto {
  @ApiProperty({ description: 'Article ID to like/unlike' })
  @IsString()
  @IsNotEmpty()
  articleId: string;
}
