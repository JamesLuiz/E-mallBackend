import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CommentArticleDto {
  @ApiProperty({ description: 'Article ID to comment on' })
  @IsString()
  @IsNotEmpty()
  articleId: string;

  @ApiProperty({ description: 'Comment content' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ description: 'Parent comment ID for replies', required: false })
  @IsString()
  @IsOptional()
  parentCommentId?: string;
}
