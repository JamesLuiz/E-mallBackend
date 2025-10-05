import { Model, Types } from 'mongoose';
import { Article, ArticleDocument, Comment, Repost } from './schemas/article.schema';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ArticleFilterDto } from './dto/article-filter.dto';
import { LikeArticleDto } from './dto/like-article.dto';
import { CommentArticleDto } from './dto/comment-article.dto';
import { RepostArticleDto } from './dto/repost-article.dto';
import { ShareArticleDto } from './dto/share-article.dto';
import { MentionUserDto } from './dto/mention-user.dto';
export declare class BlogService {
    private articleModel;
    constructor(articleModel: Model<ArticleDocument>);
    create(createArticleDto: CreateArticleDto): Promise<Article>;
    findAll(filter: ArticleFilterDto): Promise<Article[]>;
    findOne(id: string): Promise<Article>;
    update(id: string, updateArticleDto: UpdateArticleDto): Promise<Article>;
    remove(id: string): Promise<void>;
    likeArticle(userId: string, likeDto: LikeArticleDto): Promise<{
        liked: boolean;
        message: string;
    }>;
    commentArticle(userId: string, commentDto: CommentArticleDto): Promise<{
        message: string;
        comment: Comment;
    }>;
    repostArticle(userId: string, repostDto: RepostArticleDto): Promise<{
        message: string;
        repost: Repost;
    }>;
    shareArticle(userId: string, shareDto: ShareArticleDto): Promise<{
        message: string;
    }>;
    getTrendingArticles(limit?: number): Promise<Omit<import("mongoose").Document<unknown, {}, ArticleDocument> & Article & import("mongoose").Document<any, any, any> & {
        _id: Types.ObjectId;
    }, never>[]>;
    updateTrendingScore(articleId: string): Promise<void>;
    getUserTimeline(userId: string, limit?: number): Promise<Omit<import("mongoose").Document<unknown, {}, ArticleDocument> & Article & import("mongoose").Document<any, any, any> & {
        _id: Types.ObjectId;
    }, never>[]>;
    processUserMentions(content: string): Promise<string[]>;
    updateArticleMentions(articleId: string, mentionDto: MentionUserDto): Promise<{
        message: string;
        extractedMentions: string[];
        mentionedUserIds: string[];
    }>;
    getArticlesByMention(userId: string, limit?: number): Promise<Omit<import("mongoose").Document<unknown, {}, ArticleDocument> & Article & import("mongoose").Document<any, any, any> & {
        _id: Types.ObjectId;
    }, never>[]>;
    getTrendingTopics(limit?: number): Promise<any[]>;
    getAuthorAnalytics(authorId: string, period?: string): Promise<{
        period: string;
        totalArticles: number;
        totalViews: number;
        totalLikes: number;
        totalComments: number;
        totalShares: number;
        totalReposts: number;
        totalEngagement: number;
        engagementRate: number;
        topArticles: {
            _id: any;
            title: string;
            views: number;
            likes: number;
            comments: number;
            shares: number;
            trendingScore: number;
        }[];
        averageViews: number;
        averageEngagement: number;
    }>;
    getArticleAnalytics(articleId: string): Promise<{
        article: {
            _id: any;
            title: string;
            author: Types.ObjectId;
            createdAt: any;
            publishedAt: Date;
        };
        metrics: {
            views: number;
            likes: number;
            comments: number;
            shares: number;
            reposts: number;
            totalEngagement: number;
            engagementRate: number;
            trendingScore: number;
        };
        dailyViews: any[];
        engagementTimeline: any[];
    }>;
    private generateDailyViewData;
    private generateEngagementTimeline;
}
