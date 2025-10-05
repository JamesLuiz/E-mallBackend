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
exports.BlogController = void 0;
const common_1 = require("@nestjs/common");
const blog_service_1 = require("./blog.service");
const create_article_dto_1 = require("./dto/create-article.dto");
const update_article_dto_1 = require("./dto/update-article.dto");
const article_filter_dto_1 = require("./dto/article-filter.dto");
const like_article_dto_1 = require("./dto/like-article.dto");
const comment_article_dto_1 = require("./dto/comment-article.dto");
const repost_article_dto_1 = require("./dto/repost-article.dto");
const share_article_dto_1 = require("./dto/share-article.dto");
const mention_user_dto_1 = require("./dto/mention-user.dto");
const jwt_auth_guard_1 = require("../modules/auth/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const swagger_1 = require("@nestjs/swagger");
let BlogController = class BlogController {
    constructor(blogService) {
        this.blogService = blogService;
    }
    async findAll(filter) {
        return this.blogService.findAll(filter);
    }
    async findOne(id) {
        return this.blogService.findOne(id);
    }
    async create(createArticleDto) {
        return this.blogService.create(createArticleDto);
    }
    async update(id, updateArticleDto) {
        return this.blogService.update(id, updateArticleDto);
    }
    async remove(id) {
        await this.blogService.remove(id);
        return { message: 'Article deleted' };
    }
    async likeArticle(userId, likeDto) {
        return this.blogService.likeArticle(userId, likeDto);
    }
    async commentArticle(userId, commentDto) {
        return this.blogService.commentArticle(userId, commentDto);
    }
    async repostArticle(userId, repostDto) {
        return this.blogService.repostArticle(userId, repostDto);
    }
    async shareArticle(userId, shareDto) {
        return this.blogService.shareArticle(userId, shareDto);
    }
    async getTrendingArticles(limit) {
        return this.blogService.getTrendingArticles(limit);
    }
    async getUserTimeline(userId, limit) {
        return this.blogService.getUserTimeline(userId, limit);
    }
    async updateArticleMentions(articleId, mentionDto) {
        return this.blogService.updateArticleMentions(articleId, mentionDto);
    }
    async getArticlesByMention(userId, limit) {
        return this.blogService.getArticlesByMention(userId, limit);
    }
    async getTrendingTopics(limit) {
        return this.blogService.getTrendingTopics(limit);
    }
    async getAuthorAnalytics(userId, period = '30d') {
        return this.blogService.getAuthorAnalytics(userId, period);
    }
    async getArticleAnalytics(articleId) {
        return this.blogService.getArticleAnalytics(articleId);
    }
};
exports.BlogController = BlogController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [article_filter_dto_1.ArticleFilterDto]),
    __metadata("design:returntype", Promise)
], BlogController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BlogController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_article_dto_1.CreateArticleDto]),
    __metadata("design:returntype", Promise)
], BlogController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_article_dto_1.UpdateArticleDto]),
    __metadata("design:returntype", Promise)
], BlogController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BlogController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)('like'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Like or unlike an article' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Article liked/unliked successfully' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('_id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, like_article_dto_1.LikeArticleDto]),
    __metadata("design:returntype", Promise)
], BlogController.prototype, "likeArticle", null);
__decorate([
    (0, common_1.Post)('comment'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Comment on an article' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Comment added successfully' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('_id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, comment_article_dto_1.CommentArticleDto]),
    __metadata("design:returntype", Promise)
], BlogController.prototype, "commentArticle", null);
__decorate([
    (0, common_1.Post)('repost'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Repost an article' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Article reposted successfully' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('_id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, repost_article_dto_1.RepostArticleDto]),
    __metadata("design:returntype", Promise)
], BlogController.prototype, "repostArticle", null);
__decorate([
    (0, common_1.Post)('share'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Share an article' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Article shared successfully' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('_id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, share_article_dto_1.ShareArticleDto]),
    __metadata("design:returntype", Promise)
], BlogController.prototype, "shareArticle", null);
__decorate([
    (0, common_1.Get)('trending'),
    (0, swagger_1.ApiOperation)({ summary: 'Get trending articles' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Trending articles retrieved successfully' }),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], BlogController.prototype, "getTrendingArticles", null);
__decorate([
    (0, common_1.Get)('timeline'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get user timeline' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User timeline retrieved successfully' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('_id')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], BlogController.prototype, "getUserTimeline", null);
__decorate([
    (0, common_1.Post)(':id/mentions'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update article mentions' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Mentions updated successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, mention_user_dto_1.MentionUserDto]),
    __metadata("design:returntype", Promise)
], BlogController.prototype, "updateArticleMentions", null);
__decorate([
    (0, common_1.Get)('mentions'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get articles mentioning the user' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Mentioned articles retrieved successfully' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('_id')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], BlogController.prototype, "getArticlesByMention", null);
__decorate([
    (0, common_1.Get)('topics/trending'),
    (0, swagger_1.ApiOperation)({ summary: 'Get trending topics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Trending topics retrieved successfully' }),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], BlogController.prototype, "getTrendingTopics", null);
__decorate([
    (0, common_1.Get)('analytics/author'),
    (0, swagger_1.ApiOperation)({ summary: 'Get author analytics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Author analytics retrieved successfully' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('_id')),
    __param(1, (0, common_1.Query)('period')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], BlogController.prototype, "getAuthorAnalytics", null);
__decorate([
    (0, common_1.Get)('analytics/article/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get article analytics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Article analytics retrieved successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BlogController.prototype, "getArticleAnalytics", null);
exports.BlogController = BlogController = __decorate([
    (0, swagger_1.ApiTags)('Blog'),
    (0, common_1.Controller)('blog'),
    __metadata("design:paramtypes", [blog_service_1.BlogService])
], BlogController);
//# sourceMappingURL=blog.controller.js.map