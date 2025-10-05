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
exports.BlogService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const article_schema_1 = require("./schemas/article.schema");
let BlogService = class BlogService {
    constructor(articleModel) {
        this.articleModel = articleModel;
    }
    async create(createArticleDto) {
        const created = new this.articleModel(createArticleDto);
        return created.save();
    }
    async findAll(filter) {
        const query = {};
        if (filter.authorId)
            query.authorId = filter.authorId;
        if (filter.tag)
            query.tags = filter.tag;
        if (filter.search)
            query.$text = { $search: filter.search };
        return this.articleModel.find(query).exec();
    }
    async findOne(id) {
        const article = await this.articleModel.findById(id).exec();
        if (!article)
            throw new common_1.NotFoundException('Article not found');
        return article;
    }
    async update(id, updateArticleDto) {
        const article = await this.articleModel.findByIdAndUpdate(id, updateArticleDto, { new: true }).exec();
        if (!article)
            throw new common_1.NotFoundException('Article not found');
        return article;
    }
    async remove(id) {
        const result = await this.articleModel.findByIdAndDelete(id).exec();
        if (!result)
            throw new common_1.NotFoundException('Article not found');
    }
    async likeArticle(userId, likeDto) {
        const article = await this.articleModel.findById(likeDto.articleId);
        if (!article)
            throw new common_1.NotFoundException('Article not found');
        const userObjectId = new mongoose_2.Types.ObjectId(userId);
        const isLiked = article.likes.includes(userObjectId);
        if (isLiked) {
            await this.articleModel.findByIdAndUpdate(likeDto.articleId, {
                $pull: { likes: userObjectId }
            });
            return { liked: false, message: 'Article unliked' };
        }
        else {
            await this.articleModel.findByIdAndUpdate(likeDto.articleId, {
                $addToSet: { likes: userObjectId }
            });
            return { liked: true, message: 'Article liked' };
        }
    }
    async commentArticle(userId, commentDto) {
        const article = await this.articleModel.findById(commentDto.articleId);
        if (!article)
            throw new common_1.NotFoundException('Article not found');
        const comment = {
            userId: new mongoose_2.Types.ObjectId(userId),
            content: commentDto.content,
            createdAt: new Date(),
            likes: [],
            parentCommentId: commentDto.parentCommentId ? new mongoose_2.Types.ObjectId(commentDto.parentCommentId) : undefined
        };
        await this.articleModel.findByIdAndUpdate(commentDto.articleId, {
            $push: { comments: comment }
        });
        return { message: 'Comment added successfully', comment };
    }
    async repostArticle(userId, repostDto) {
        const originalArticle = await this.articleModel.findById(repostDto.articleId);
        if (!originalArticle)
            throw new common_1.NotFoundException('Article not found');
        const existingRepost = originalArticle.reposts.find(repost => repost.userId.toString() === userId);
        if (existingRepost) {
            throw new common_1.BadRequestException('You have already reposted this article');
        }
        const repost = {
            userId: new mongoose_2.Types.ObjectId(userId),
            createdAt: new Date(),
            comment: repostDto.comment
        };
        await this.articleModel.findByIdAndUpdate(repostDto.articleId, {
            $push: { reposts: repost }
        });
        return { message: 'Article reposted successfully', repost };
    }
    async shareArticle(userId, shareDto) {
        const article = await this.articleModel.findById(shareDto.articleId);
        if (!article)
            throw new common_1.NotFoundException('Article not found');
        const userObjectId = new mongoose_2.Types.ObjectId(userId);
        await this.articleModel.findByIdAndUpdate(shareDto.articleId, {
            $addToSet: { shares: userObjectId }
        });
        return { message: 'Article shared successfully' };
    }
    async getTrendingArticles(limit = 10) {
        return this.articleModel
            .find({ status: 'published' })
            .sort({ trendingScore: -1, createdAt: -1 })
            .limit(limit)
            .populate('authorId', 'firstName lastName email avatar')
            .exec();
    }
    async updateTrendingScore(articleId) {
        const article = await this.articleModel.findById(articleId);
        if (!article)
            return;
        const likesWeight = article.likes.length * 1;
        const commentsWeight = article.comments.length * 2;
        const repostsWeight = article.reposts.length * 3;
        const sharesWeight = article.shares.length * 2;
        const viewsWeight = article.viewCount * 0.1;
        const trendingScore = likesWeight + commentsWeight + repostsWeight + sharesWeight + viewsWeight;
        await this.articleModel.findByIdAndUpdate(articleId, { trendingScore });
    }
    async getUserTimeline(userId, limit = 20) {
        return this.articleModel
            .find({
            $or: [
                { authorId: new mongoose_2.Types.ObjectId(userId) },
                { 'reposts.userId': new mongoose_2.Types.ObjectId(userId) }
            ],
            status: 'published'
        })
            .sort({ createdAt: -1 })
            .limit(limit)
            .populate('authorId', 'firstName lastName email avatar')
            .exec();
    }
    async processUserMentions(content) {
        const mentionRegex = /@(\w+)/g;
        const mentions = [];
        let match;
        while ((match = mentionRegex.exec(content)) !== null) {
            mentions.push(match[1]);
        }
        return mentions;
    }
    async updateArticleMentions(articleId, mentionDto) {
        const article = await this.articleModel.findById(articleId);
        if (!article)
            throw new common_1.NotFoundException('Article not found');
        const extractedMentions = await this.processUserMentions(mentionDto.content);
        const mentionedUserIds = mentionDto.mentionedUserIds.map(id => new mongoose_2.Types.ObjectId(id));
        await this.articleModel.findByIdAndUpdate(articleId, {
            $set: { mentions: mentionedUserIds }
        });
        return {
            message: 'Mentions updated successfully',
            extractedMentions,
            mentionedUserIds: mentionDto.mentionedUserIds
        };
    }
    async getArticlesByMention(userId, limit = 20) {
        return this.articleModel
            .find({
            mentions: new mongoose_2.Types.ObjectId(userId),
            status: 'published'
        })
            .sort({ createdAt: -1 })
            .limit(limit)
            .populate('authorId', 'firstName lastName email avatar')
            .exec();
    }
    async getTrendingTopics(limit = 10) {
        const pipeline = [
            { $match: { status: 'published' } },
            { $unwind: '$tags' },
            { $group: { _id: '$tags', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: limit }
        ];
        return this.articleModel.aggregate(pipeline).exec();
    }
    async getAuthorAnalytics(authorId, period = '30d') {
        const now = new Date();
        let startDate;
        switch (period) {
            case '7d':
                startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                break;
            case '30d':
                startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                break;
            case '90d':
                startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
                break;
            default:
                startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        }
        const articles = await this.articleModel
            .find({
            authorId: new mongoose_2.Types.ObjectId(authorId),
            createdAt: { $gte: startDate }
        })
            .exec();
        const totalViews = articles.reduce((sum, article) => sum + article.viewCount, 0);
        const totalLikes = articles.reduce((sum, article) => sum + article.likes.length, 0);
        const totalComments = articles.reduce((sum, article) => sum + article.comments.length, 0);
        const totalShares = articles.reduce((sum, article) => sum + article.shares.length, 0);
        const totalReposts = articles.reduce((sum, article) => sum + article.reposts.length, 0);
        const topArticles = articles
            .sort((a, b) => (b.likes.length + b.comments.length + b.shares.length) -
            (a.likes.length + a.comments.length + a.shares.length))
            .slice(0, 5)
            .map(article => ({
            _id: article._id,
            title: article.title,
            views: article.viewCount,
            likes: article.likes.length,
            comments: article.comments.length,
            shares: article.shares.length,
            trendingScore: article.trendingScore
        }));
        const totalEngagement = totalLikes + totalComments + totalShares + totalReposts;
        const engagementRate = totalViews > 0 ? (totalEngagement / totalViews) * 100 : 0;
        return {
            period,
            totalArticles: articles.length,
            totalViews,
            totalLikes,
            totalComments,
            totalShares,
            totalReposts,
            totalEngagement,
            engagementRate: Math.round(engagementRate * 100) / 100,
            topArticles,
            averageViews: articles.length > 0 ? Math.round(totalViews / articles.length) : 0,
            averageEngagement: articles.length > 0 ? Math.round(totalEngagement / articles.length) : 0
        };
    }
    async getArticleAnalytics(articleId) {
        const article = await this.articleModel
            .findById(articleId)
            .populate('authorId', 'firstName lastName')
            .exec();
        if (!article) {
            throw new common_1.NotFoundException('Article not found');
        }
        const totalEngagement = article.likes.length + article.comments.length +
            article.shares.length + article.reposts.length;
        const engagementRate = article.viewCount > 0 ? (totalEngagement / article.viewCount) * 100 : 0;
        const dailyViews = this.generateDailyViewData(article.viewCount, 30);
        const engagementTimeline = this.generateEngagementTimeline(article);
        return {
            article: {
                _id: article._id,
                title: article.title,
                author: article.authorId,
                createdAt: article.createdAt,
                publishedAt: article.publishedAt
            },
            metrics: {
                views: article.viewCount,
                likes: article.likes.length,
                comments: article.comments.length,
                shares: article.shares.length,
                reposts: article.reposts.length,
                totalEngagement,
                engagementRate: Math.round(engagementRate * 100) / 100,
                trendingScore: article.trendingScore
            },
            dailyViews,
            engagementTimeline
        };
    }
    generateDailyViewData(totalViews, days) {
        const data = [];
        const avgDailyViews = Math.floor(totalViews / days);
        for (let i = days - 1; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const variation = Math.random() * 0.4 - 0.2;
            const views = Math.max(0, Math.floor(avgDailyViews * (1 + variation)));
            data.push({
                date: date.toISOString().split('T')[0],
                views
            });
        }
        return data;
    }
    generateEngagementTimeline(article) {
        const timeline = [];
        const daysSinceCreation = Math.floor((Date.now() - new Date(article.createdAt).getTime()) / (24 * 60 * 60 * 1000));
        for (let i = Math.min(daysSinceCreation, 30); i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const baseEngagement = Math.floor(article.likes.length / Math.max(daysSinceCreation, 1));
            const variation = Math.random() * 0.6 - 0.3;
            const engagement = Math.max(0, Math.floor(baseEngagement * (1 + variation)));
            timeline.push({
                date: date.toISOString().split('T')[0],
                likes: Math.floor(engagement * 0.6),
                comments: Math.floor(engagement * 0.2),
                shares: Math.floor(engagement * 0.2)
            });
        }
        return timeline;
    }
};
exports.BlogService = BlogService;
exports.BlogService = BlogService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(article_schema_1.Article.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], BlogService);
//# sourceMappingURL=blog.service.js.map