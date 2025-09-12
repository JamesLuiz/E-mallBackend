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
import { ApiTags, ApiBearerAuth, ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';
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
}