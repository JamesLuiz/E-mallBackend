"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiAssistantController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../modules/auth/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const ai_assistant_service_1 = require("./ai-assistant.service");
const chat_message_dto_1 = require("./dto/chat-message.dto");
const product_search_dto_1 = require("./dto/product-search.dto");
const location_search_dto_1 = require("./dto/location-search.dto");
const price_range_search_dto_1 = require("./dto/price-range-search.dto");
const support_query_dto_1 = require("./dto/support-query.dto");
let AiAssistantController = class AiAssistantController {
    constructor(aiAssistantService) {
        this.aiAssistantService = aiAssistantService;
    }
    async chat(userId, chatMessageDto) {
        return this.aiAssistantService.processMessage(userId, chatMessageDto);
    }
    async getSessions(userId) {
        return this.aiAssistantService.getUserSessions(userId);
    }
    async getSession(userId, sessionId) {
        return this.aiAssistantService.getSession(userId, sessionId);
    }
    async deleteSession(userId, sessionId) {
        return this.aiAssistantService.deleteSession(userId, sessionId);
    }
    async searchProducts(userId, searchDto) {
        return this.aiAssistantService.searchProducts(userId, searchDto);
    }
    async findDiscountedProducts(userId, searchDto) {
        return this.aiAssistantService.findDiscountedProducts(userId, searchDto);
    }
    async findProductsByPriceRange(userId, priceRangeDto) {
        return this.aiAssistantService.findProductsByPriceRange(userId, priceRangeDto);
    }
    async findProductsByLocation(userId, locationDto) {
        return this.aiAssistantService.findProductsByLocation(userId, locationDto);
    }
    async getSupport(userId, supportDto) {
        return this.aiAssistantService.provideSupportAssistance(userId, supportDto);
    }
    async getPersonalizedSuggestions(userId, category, limit) {
        return this.aiAssistantService.getPersonalizedSuggestions(userId, category, limit);
    }
    async getNavigationHelp(userId, section) {
        return this.aiAssistantService.getNavigationHelp(userId, section);
    }
    async compareProducts(userId, productIds) {
        return this.aiAssistantService.compareProducts(userId, productIds);
    }
    async getRecommendations(userId, productId) {
        return this.aiAssistantService.getAiRecommendations(userId, productId);
    }
    async generateAutoTags(userId, body) {
        const tags = await this.aiAssistantService.generateAutoTags(body.content);
        return { tags };
    }
    async improveContent(userId, body) {
        const improvements = await this.aiAssistantService.suggestContentImprovements(body.content);
        return { improvements };
    }
    async suggestTitles(userId, body) {
        const titles = await this.aiAssistantService.generateTitleSuggestions(body.content);
        return { titles };
    }
    async generateContentIdeas(userId, body) {
        const ideas = await this.aiAssistantService.generateContentIdeas(body.topic, body.category);
        return { ideas };
    }
    async moderateContent(userId, body) {
        const result = await this.aiAssistantService.moderateContent(body.content);
        return result;
    }
    async detectPlagiarism(userId, body) {
        const result = await this.aiAssistantService.detectPlagiarism(body.content);
        return result;
    }
    async generateContentReport(userId, body) {
        const report = await this.aiAssistantService.generateContentReport(body.content);
        return report;
    }
};
exports.AiAssistantController = AiAssistantController;
__decorate([
    (0, common_1.Post)('chat'),
    (0, swagger_1.ApiOperation)({ summary: 'Send message to AI assistant' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('_id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, chat_message_dto_1.ChatMessageDto]),
    __metadata("design:returntype", Promise)
], AiAssistantController.prototype, "chat", null);
__decorate([
    (0, common_1.Get)('sessions'),
    (0, swagger_1.ApiOperation)({ summary: 'Get user chat sessions' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AiAssistantController.prototype, "getSessions", null);
__decorate([
    (0, common_1.Get)('sessions/:sessionId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get specific chat session' }),
    (0, swagger_1.ApiParam)({ name: 'sessionId', description: 'Chat session ID' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('_id')),
    __param(1, (0, common_1.Param)('sessionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AiAssistantController.prototype, "getSession", null);
__decorate([
    (0, common_1.Delete)('sessions/:sessionId'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete chat session' }),
    (0, swagger_1.ApiParam)({ name: 'sessionId', description: 'Chat session ID' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('_id')),
    __param(1, (0, common_1.Param)('sessionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AiAssistantController.prototype, "deleteSession", null);
__decorate([
    (0, common_1.Post)('search/products'),
    (0, swagger_1.ApiOperation)({ summary: 'AI-powered product search' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('_id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, product_search_dto_1.ProductSearchDto]),
    __metadata("design:returntype", Promise)
], AiAssistantController.prototype, "searchProducts", null);
__decorate([
    (0, common_1.Post)('search/discounts'),
    (0, swagger_1.ApiOperation)({ summary: 'Find products with discounts' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('_id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, product_search_dto_1.ProductSearchDto]),
    __metadata("design:returntype", Promise)
], AiAssistantController.prototype, "findDiscountedProducts", null);
__decorate([
    (0, common_1.Post)('search/price-range'),
    (0, swagger_1.ApiOperation)({ summary: 'Find products within price range' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('_id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, price_range_search_dto_1.PriceRangeSearchDto]),
    __metadata("design:returntype", Promise)
], AiAssistantController.prototype, "findProductsByPriceRange", null);
__decorate([
    (0, common_1.Post)('search/location'),
    (0, swagger_1.ApiOperation)({ summary: 'Find products by vendor location' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('_id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, location_search_dto_1.LocationSearchDto]),
    __metadata("design:returntype", Promise)
], AiAssistantController.prototype, "findProductsByLocation", null);
__decorate([
    (0, common_1.Post)('support'),
    (0, swagger_1.ApiOperation)({ summary: 'Get customer support assistance' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('_id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, support_query_dto_1.SupportQueryDto]),
    __metadata("design:returntype", Promise)
], AiAssistantController.prototype, "getSupport", null);
__decorate([
    (0, common_1.Get)('suggestions'),
    (0, swagger_1.ApiOperation)({ summary: 'Get personalized product suggestions' }),
    (0, swagger_1.ApiQuery)({ name: 'category', required: false, description: 'Product category' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, description: 'Number of suggestions' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('_id')),
    __param(1, (0, common_1.Query)('category')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number]),
    __metadata("design:returntype", Promise)
], AiAssistantController.prototype, "getPersonalizedSuggestions", null);
__decorate([
    (0, common_1.Get)('navigation/help'),
    (0, swagger_1.ApiOperation)({ summary: 'Get navigation assistance' }),
    (0, swagger_1.ApiQuery)({ name: 'section', required: false, description: 'App section for help' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('_id')),
    __param(1, (0, common_1.Query)('section')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AiAssistantController.prototype, "getNavigationHelp", null);
__decorate([
    (0, common_1.Post)('compare'),
    (0, swagger_1.ApiOperation)({ summary: 'Compare multiple products' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('_id')),
    __param(1, (0, common_1.Body)('productIds')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array]),
    __metadata("design:returntype", Promise)
], AiAssistantController.prototype, "compareProducts", null);
__decorate([
    (0, common_1.Get)('recommendations/:productId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get AI-powered product recommendations' }),
    (0, swagger_1.ApiParam)({ name: 'productId', description: 'Product ID for recommendations' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('_id')),
    __param(1, (0, common_1.Param)('productId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AiAssistantController.prototype, "getRecommendations", null);
__decorate([
    (0, common_1.Post)('blog/auto-tag'),
    (0, swagger_1.ApiOperation)({ summary: 'Generate auto-tags for blog content' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Auto-tags generated successfully' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('_id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AiAssistantController.prototype, "generateAutoTags", null);
__decorate([
    (0, common_1.Post)('blog/improve-content'),
    (0, swagger_1.ApiOperation)({ summary: 'Get content improvement suggestions' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Content improvements generated successfully' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('_id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AiAssistantController.prototype, "improveContent", null);
__decorate([
    (0, common_1.Post)('blog/suggest-titles'),
    (0, swagger_1.ApiOperation)({ summary: 'Generate title suggestions for content' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Title suggestions generated successfully' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('_id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AiAssistantController.prototype, "suggestTitles", null);
__decorate([
    (0, common_1.Post)('blog/content-ideas'),
    (0, swagger_1.ApiOperation)({ summary: 'Generate content ideas for a topic' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Content ideas generated successfully' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('_id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AiAssistantController.prototype, "generateContentIdeas", null);
__decorate([
    (0, common_1.Post)('moderate'),
    (0, swagger_1.ApiOperation)({ summary: 'Moderate content for inappropriate material' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Content moderation completed' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('_id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AiAssistantController.prototype, "moderateContent", null);
__decorate([
    (0, common_1.Post)('plagiarism-check'),
    (0, swagger_1.ApiOperation)({ summary: 'Check content for plagiarism' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Plagiarism check completed' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('_id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AiAssistantController.prototype, "detectPlagiarism", null);
__decorate([
    (0, common_1.Post)('content-report'),
    (0, swagger_1.ApiOperation)({ summary: 'Generate detailed content analysis report' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Content report generated successfully' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('_id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AiAssistantController.prototype, "generateContentReport", null);
exports.AiAssistantController = AiAssistantController = __decorate([
    (0, swagger_1.ApiTags)('AI Assistant'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('ai-assistant'),
    __metadata("design:paramtypes", [ai_assistant_service_1.AiAssistantService])
], AiAssistantController);
//# sourceMappingURL=ai-assistant.controller.js.map