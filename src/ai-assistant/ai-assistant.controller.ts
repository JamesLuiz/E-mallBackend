import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Query,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../modules/auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { AiAssistantService } from './ai-assistant.service';
import { ChatMessageDto } from './dto/chat-message.dto';
import { ProductSearchDto } from './dto/product-search.dto';
import { LocationSearchDto } from './dto/location-search.dto';
import { PriceRangeSearchDto } from './dto/price-range-search.dto';
import { SupportQueryDto } from './dto/support-query.dto';

@ApiTags('AI Assistant')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('ai-assistant')
export class AiAssistantController {
  constructor(private readonly aiAssistantService: AiAssistantService) {}

  @Post('chat')
  @ApiOperation({ summary: 'Send message to AI assistant' })
  async chat(
    @CurrentUser('_id') userId: string,
    @Body() chatMessageDto: ChatMessageDto,
  ) {
    return this.aiAssistantService.processMessage(userId, chatMessageDto);
  }

  @Get('sessions')
  @ApiOperation({ summary: 'Get user chat sessions' })
  async getSessions(@CurrentUser('_id') userId: string) {
    return this.aiAssistantService.getUserSessions(userId);
  }

  @Get('sessions/:sessionId')
  @ApiOperation({ summary: 'Get specific chat session' })
  @ApiParam({ name: 'sessionId', description: 'Chat session ID' })
  async getSession(
    @CurrentUser('_id') userId: string,
    @Param('sessionId') sessionId: string,
  ) {
    return this.aiAssistantService.getSession(userId, sessionId);
  }

  @Delete('sessions/:sessionId')
  @ApiOperation({ summary: 'Delete chat session' })
  @ApiParam({ name: 'sessionId', description: 'Chat session ID' })
  async deleteSession(
    @CurrentUser('_id') userId: string,
    @Param('sessionId') sessionId: string,
  ) {
    return this.aiAssistantService.deleteSession(userId, sessionId);
  }

  @Post('search/products')
  @ApiOperation({ summary: 'AI-powered product search' })
  async searchProducts(
    @CurrentUser('_id') userId: string,
    @Body() searchDto: ProductSearchDto,
  ) {
    return this.aiAssistantService.searchProducts(userId, searchDto);
  }

  @Post('search/discounts')
  @ApiOperation({ summary: 'Find products with discounts' })
  async findDiscountedProducts(
    @CurrentUser('_id') userId: string,
    @Body() searchDto: ProductSearchDto,
  ) {
    return this.aiAssistantService.findDiscountedProducts(userId, searchDto);
  }

  @Post('search/price-range')
  @ApiOperation({ summary: 'Find products within price range' })
  async findProductsByPriceRange(
    @CurrentUser('_id') userId: string,
    @Body() priceRangeDto: PriceRangeSearchDto,
  ) {
    return this.aiAssistantService.findProductsByPriceRange(userId, priceRangeDto);
  }

  @Post('search/location')
  @ApiOperation({ summary: 'Find products by vendor location' })
  async findProductsByLocation(
    @CurrentUser('_id') userId: string,
    @Body() locationDto: LocationSearchDto,
  ) {
    return this.aiAssistantService.findProductsByLocation(userId, locationDto);
  }

  @Post('support')
  @ApiOperation({ summary: 'Get customer support assistance' })
  async getSupport(
    @CurrentUser('_id') userId: string,
    @Body() supportDto: SupportQueryDto,
  ) {
    return this.aiAssistantService.provideSupportAssistance(userId, supportDto);
  }

  @Get('suggestions')
  @ApiOperation({ summary: 'Get personalized product suggestions' })
  @ApiQuery({ name: 'category', required: false, description: 'Product category' })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of suggestions' })
  async getPersonalizedSuggestions(
    @CurrentUser('_id') userId: string,
    @Query('category') category?: string,
    @Query('limit') limit?: number,
  ) {
    return this.aiAssistantService.getPersonalizedSuggestions(userId, category, limit);
  }

  @Get('navigation/help')
  @ApiOperation({ summary: 'Get navigation assistance' })
  @ApiQuery({ name: 'section', required: false, description: 'App section for help' })
  async getNavigationHelp(
    @CurrentUser('_id') userId: string,
    @Query('section') section?: string,
  ) {
    return this.aiAssistantService.getNavigationHelp(userId, section);
  }

  @Post('compare')
  @ApiOperation({ summary: 'Compare multiple products' })
  async compareProducts(
    @CurrentUser('_id') userId: string,
    @Body('productIds') productIds: string[],
  ) {
    return this.aiAssistantService.compareProducts(userId, productIds);
  }

  @Get('recommendations/:productId')
  @ApiOperation({ summary: 'Get AI-powered product recommendations' })
  @ApiParam({ name: 'productId', description: 'Product ID for recommendations' })
  async getRecommendations(
    @CurrentUser('_id') userId: string,
    @Param('productId') productId: string,
  ) {
    return this.aiAssistantService.getAiRecommendations(userId, productId);
  }

  // Blog content AI endpoints
  @Post('blog/auto-tag')
  @ApiOperation({ summary: 'Generate auto-tags for blog content' })
  @ApiResponse({ status: 200, description: 'Auto-tags generated successfully' })
  async generateAutoTags(
    @CurrentUser('_id') userId: string,
    @Body() body: { content: string }
  ) {
    const tags = await this.aiAssistantService.generateAutoTags(body.content);
    return { tags };
  }

  @Post('blog/improve-content')
  @ApiOperation({ summary: 'Get content improvement suggestions' })
  @ApiResponse({ status: 200, description: 'Content improvements generated successfully' })
  async improveContent(
    @CurrentUser('_id') userId: string,
    @Body() body: { content: string }
  ) {
    const improvements = await this.aiAssistantService.suggestContentImprovements(body.content);
    return { improvements };
  }

  @Post('blog/suggest-titles')
  @ApiOperation({ summary: 'Generate title suggestions for content' })
  @ApiResponse({ status: 200, description: 'Title suggestions generated successfully' })
  async suggestTitles(
    @CurrentUser('_id') userId: string,
    @Body() body: { content: string }
  ) {
    const titles = await this.aiAssistantService.generateTitleSuggestions(body.content);
    return { titles };
  }

  @Post('blog/content-ideas')
  @ApiOperation({ summary: 'Generate content ideas for a topic' })
  @ApiResponse({ status: 200, description: 'Content ideas generated successfully' })
  async generateContentIdeas(
    @CurrentUser('_id') userId: string,
    @Body() body: { topic: string; category: string }
  ) {
    const ideas = await this.aiAssistantService.generateContentIdeas(body.topic, body.category);
    return { ideas };
  }

  // Content moderation endpoints
  @Post('moderate')
  @ApiOperation({ summary: 'Moderate content for inappropriate material' })
  @ApiResponse({ status: 200, description: 'Content moderation completed' })
  async moderateContent(
    @CurrentUser('_id') userId: string,
    @Body() body: { content: string }
  ) {
    const result = await this.aiAssistantService.moderateContent(body.content);
    return result;
  }

  @Post('plagiarism-check')
  @ApiOperation({ summary: 'Check content for plagiarism' })
  @ApiResponse({ status: 200, description: 'Plagiarism check completed' })
  async detectPlagiarism(
    @CurrentUser('_id') userId: string,
    @Body() body: { content: string }
  ) {
    const result = await this.aiAssistantService.detectPlagiarism(body.content);
    return result;
  }

  @Post('content-report')
  @ApiOperation({ summary: 'Generate detailed content analysis report' })
  @ApiResponse({ status: 200, description: 'Content report generated successfully' })
  async generateContentReport(
    @CurrentUser('_id') userId: string,
    @Body() body: { content: string }
  ) {
    const report = await this.aiAssistantService.generateContentReport(body.content);
    return report;
  }
}