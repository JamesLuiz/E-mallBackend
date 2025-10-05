import { Controller, Get, Post, Body, Param, Delete, Query, Put, UseGuards } from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ArticleFilterDto } from './dto/article-filter.dto';
import { LikeArticleDto } from './dto/like-article.dto';
import { CommentArticleDto } from './dto/comment-article.dto';
import { RepostArticleDto } from './dto/repost-article.dto';
import { ShareArticleDto } from './dto/share-article.dto';
import { MentionUserDto } from './dto/mention-user.dto';
import { JwtAuthGuard } from '../modules/auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';

@ApiTags('Blog')
@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Get()
  async findAll(@Query() filter: ArticleFilterDto) {
    return this.blogService.findAll(filter);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.blogService.findOne(id);
  }

  @Post()
  async create(@Body() createArticleDto: CreateArticleDto) {
    return this.blogService.create(createArticleDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateArticleDto: UpdateArticleDto) {
    return this.blogService.update(id, updateArticleDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.blogService.remove(id);
    return { message: 'Article deleted' };
  }

  // Social interaction endpoints
  @Post('like')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Like or unlike an article' })
  @ApiResponse({ status: 200, description: 'Article liked/unliked successfully' })
  async likeArticle(@CurrentUser('_id') userId: string, @Body() likeDto: LikeArticleDto) {
    return this.blogService.likeArticle(userId, likeDto);
  }

  @Post('comment')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Comment on an article' })
  @ApiResponse({ status: 200, description: 'Comment added successfully' })
  async commentArticle(@CurrentUser('_id') userId: string, @Body() commentDto: CommentArticleDto) {
    return this.blogService.commentArticle(userId, commentDto);
  }

  @Post('repost')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Repost an article' })
  @ApiResponse({ status: 200, description: 'Article reposted successfully' })
  async repostArticle(@CurrentUser('_id') userId: string, @Body() repostDto: RepostArticleDto) {
    return this.blogService.repostArticle(userId, repostDto);
  }

  @Post('share')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Share an article' })
  @ApiResponse({ status: 200, description: 'Article shared successfully' })
  async shareArticle(@CurrentUser('_id') userId: string, @Body() shareDto: ShareArticleDto) {
    return this.blogService.shareArticle(userId, shareDto);
  }

  @Get('trending')
  @ApiOperation({ summary: 'Get trending articles' })
  @ApiResponse({ status: 200, description: 'Trending articles retrieved successfully' })
  async getTrendingArticles(@Query('limit') limit?: number) {
    return this.blogService.getTrendingArticles(limit);
  }

  @Get('timeline')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user timeline' })
  @ApiResponse({ status: 200, description: 'User timeline retrieved successfully' })
  async getUserTimeline(@CurrentUser('_id') userId: string, @Query('limit') limit?: number) {
    return this.blogService.getUserTimeline(userId, limit);
  }

  @Post(':id/mentions')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update article mentions' })
  @ApiResponse({ status: 200, description: 'Mentions updated successfully' })
  async updateArticleMentions(@Param('id') articleId: string, @Body() mentionDto: MentionUserDto) {
    return this.blogService.updateArticleMentions(articleId, mentionDto);
  }

  @Get('mentions')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get articles mentioning the user' })
  @ApiResponse({ status: 200, description: 'Mentioned articles retrieved successfully' })
  async getArticlesByMention(@CurrentUser('_id') userId: string, @Query('limit') limit?: number) {
    return this.blogService.getArticlesByMention(userId, limit);
  }

  @Get('topics/trending')
  @ApiOperation({ summary: 'Get trending topics' })
  @ApiResponse({ status: 200, description: 'Trending topics retrieved successfully' })
  async getTrendingTopics(@Query('limit') limit?: number) {
    return this.blogService.getTrendingTopics(limit);
  }

  // Analytics endpoints
  @Get('analytics/author')
  @ApiOperation({ summary: 'Get author analytics' })
  @ApiResponse({ status: 200, description: 'Author analytics retrieved successfully' })
  async getAuthorAnalytics(
    @CurrentUser('_id') userId: string,
    @Query('period') period: string = '30d'
  ) {
    return this.blogService.getAuthorAnalytics(userId, period);
  }

  @Get('analytics/article/:id')
  @ApiOperation({ summary: 'Get article analytics' })
  @ApiResponse({ status: 200, description: 'Article analytics retrieved successfully' })
  async getArticleAnalytics(@Param('id') articleId: string) {
    return this.blogService.getArticleAnalytics(articleId);
  }
}
