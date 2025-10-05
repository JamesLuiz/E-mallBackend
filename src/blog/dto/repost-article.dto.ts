import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RepostArticleDto {
  @ApiProperty({ description: 'Article ID to repost' })
  @IsString()
  @IsNotEmpty()
  articleId: string;

  @ApiProperty({ description: 'Optional comment when reposting', required: false })
  @IsString()
  @IsOptional()
  comment?: string;
}
