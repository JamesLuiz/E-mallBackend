import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
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

@Injectable()
export class BlogService {
  constructor(
    @InjectModel(Article.name) private articleModel: Model<ArticleDocument>,
  ) {}

  async create(createArticleDto: CreateArticleDto): Promise<Article> {
    const created = new this.articleModel(createArticleDto);
    return created.save();
  }

  async findAll(filter: ArticleFilterDto): Promise<Article[]> {
    const query: any = {};
    if (filter.authorId) query.authorId = filter.authorId;
    if (filter.tag) query.tags = filter.tag;
    if (filter.search) query.$text = { $search: filter.search };
    return this.articleModel.find(query).exec();
  }

  async findOne(id: string): Promise<Article> {
    const article = await this.articleModel.findById(id).exec();
    if (!article) throw new NotFoundException('Article not found');
    return article;
  }

  async update(id: string, updateArticleDto: UpdateArticleDto): Promise<Article> {
    const article = await this.articleModel.findByIdAndUpdate(id, updateArticleDto, { new: true }).exec();
    if (!article) throw new NotFoundException('Article not found');
    return article;
  }

  async remove(id: string): Promise<void> {
    const result = await this.articleModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException('Article not found');
  }

  // Social interaction methods
  async likeArticle(userId: string, likeDto: LikeArticleDto) {
    const article = await this.articleModel.findById(likeDto.articleId);
    if (!article) throw new NotFoundException('Article not found');

    const userObjectId = new Types.ObjectId(userId);
    const isLiked = article.likes.includes(userObjectId);

    if (isLiked) {
      // Unlike
      await this.articleModel.findByIdAndUpdate(likeDto.articleId, {
        $pull: { likes: userObjectId }
      });
      return { liked: false, message: 'Article unliked' };
    } else {
      // Like
      await this.articleModel.findByIdAndUpdate(likeDto.articleId, {
        $addToSet: { likes: userObjectId }
      });
      return { liked: true, message: 'Article liked' };
    }
  }

  async commentArticle(userId: string, commentDto: CommentArticleDto) {
    const article = await this.articleModel.findById(commentDto.articleId);
    if (!article) throw new NotFoundException('Article not found');

    const comment: Comment = {
      userId: new Types.ObjectId(userId),
      content: commentDto.content,
      createdAt: new Date(),
      likes: [],
      parentCommentId: commentDto.parentCommentId ? new Types.ObjectId(commentDto.parentCommentId) : undefined
    };

    await this.articleModel.findByIdAndUpdate(commentDto.articleId, {
      $push: { comments: comment }
    });

    return { message: 'Comment added successfully', comment };
  }

  async repostArticle(userId: string, repostDto: RepostArticleDto) {
    const originalArticle = await this.articleModel.findById(repostDto.articleId);
    if (!originalArticle) throw new NotFoundException('Article not found');

    // Check if user already reposted this article
    const existingRepost = originalArticle.reposts.find(repost => 
      repost.userId.toString() === userId
    );
    if (existingRepost) {
      throw new BadRequestException('You have already reposted this article');
    }

    const repost: Repost = {
      userId: new Types.ObjectId(userId),
      createdAt: new Date(),
      comment: repostDto.comment
    };

    await this.articleModel.findByIdAndUpdate(repostDto.articleId, {
      $push: { reposts: repost }
    });

    return { message: 'Article reposted successfully', repost };
  }

  async shareArticle(userId: string, shareDto: ShareArticleDto) {
    const article = await this.articleModel.findById(shareDto.articleId);
    if (!article) throw new NotFoundException('Article not found');

    const userObjectId = new Types.ObjectId(userId);
    await this.articleModel.findByIdAndUpdate(shareDto.articleId, {
      $addToSet: { shares: userObjectId }
    });

    return { message: 'Article shared successfully' };
  }

  async getTrendingArticles(limit: number = 10) {
    return this.articleModel
      .find({ status: 'published' })
      .sort({ trendingScore: -1, createdAt: -1 })
      .limit(limit)
      .populate('authorId', 'firstName lastName email avatar')
      .exec();
  }

  async updateTrendingScore(articleId: string) {
    const article = await this.articleModel.findById(articleId);
    if (!article) return;

    // Calculate trending score based on engagement
    const likesWeight = article.likes.length * 1;
    const commentsWeight = article.comments.length * 2;
    const repostsWeight = article.reposts.length * 3;
    const sharesWeight = article.shares.length * 2;
    const viewsWeight = article.viewCount * 0.1;

    const trendingScore = likesWeight + commentsWeight + repostsWeight + sharesWeight + viewsWeight;

    await this.articleModel.findByIdAndUpdate(articleId, { trendingScore });
  }

  async getUserTimeline(userId: string, limit: number = 20) {
    // Get articles from followed users and user's own articles
    // For now, return user's own articles and reposts
    return this.articleModel
      .find({
        $or: [
          { authorId: new Types.ObjectId(userId) },
          { 'reposts.userId': new Types.ObjectId(userId) }
        ],
        status: 'published'
      })
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('authorId', 'firstName lastName email avatar')
      .exec();
  }

  // User mention and tagging methods
  async processUserMentions(content: string): Promise<string[]> {
    // Extract @username mentions from content
    const mentionRegex = /@(\w+)/g;
    const mentions: string[] = [];
    let match;
    
    while ((match = mentionRegex.exec(content)) !== null) {
      mentions.push(match[1]);
    }
    
    return mentions;
  }

  async updateArticleMentions(articleId: string, mentionDto: MentionUserDto) {
    const article = await this.articleModel.findById(articleId);
    if (!article) throw new NotFoundException('Article not found');

    // Process mentions from content
    const extractedMentions = await this.processUserMentions(mentionDto.content);
    
    // Convert user IDs to ObjectIds
    const mentionedUserIds = mentionDto.mentionedUserIds.map(id => new Types.ObjectId(id));
    
    // Update article with mentions
    await this.articleModel.findByIdAndUpdate(articleId, {
      $set: { mentions: mentionedUserIds }
    });

    return { 
      message: 'Mentions updated successfully', 
      extractedMentions,
      mentionedUserIds: mentionDto.mentionedUserIds 
    };
  }

  async getArticlesByMention(userId: string, limit: number = 20) {
    return this.articleModel
      .find({ 
        mentions: new Types.ObjectId(userId),
        status: 'published'
      })
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('authorId', 'firstName lastName email avatar')
      .exec();
  }

  async getTrendingTopics(limit: number = 10) {
    // Aggregate tags to find trending topics
    const pipeline: any[] = [
      { $match: { status: 'published' } },
      { $unwind: '$tags' },
      { $group: { _id: '$tags', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: limit }
    ];

    return this.articleModel.aggregate(pipeline).exec();
  }

  // Analytics methods
  async getAuthorAnalytics(authorId: string, period: string = '30d') {
    const now = new Date();
    let startDate: Date;

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

    // Get author's articles
    const articles = await this.articleModel
      .find({ 
        authorId: new Types.ObjectId(authorId),
        createdAt: { $gte: startDate }
      })
      .exec();

    // Calculate total metrics
    const totalViews = articles.reduce((sum, article) => sum + article.viewCount, 0);
    const totalLikes = articles.reduce((sum, article) => sum + article.likes.length, 0);
    const totalComments = articles.reduce((sum, article) => sum + article.comments.length, 0);
    const totalShares = articles.reduce((sum, article) => sum + article.shares.length, 0);
    const totalReposts = articles.reduce((sum, article) => sum + article.reposts.length, 0);

    // Get top performing articles
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

    // Engagement rate calculation
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

  async getArticleAnalytics(articleId: string) {
    const article = await this.articleModel
      .findById(articleId)
      .populate('authorId', 'firstName lastName')
      .exec();

    if (!article) {
      throw new NotFoundException('Article not found');
    }

    // Calculate engagement metrics
    const totalEngagement = article.likes.length + article.comments.length + 
                           article.shares.length + article.reposts.length;
    const engagementRate = article.viewCount > 0 ? (totalEngagement / article.viewCount) * 100 : 0;

    // Get daily view data (simulated)
    const dailyViews = this.generateDailyViewData(article.viewCount, 30);

    // Get engagement timeline (simulated)
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

  private generateDailyViewData(totalViews: number, days: number) {
    const data = [];
    const avgDailyViews = Math.floor(totalViews / days);
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      // Simulate realistic view distribution
      const variation = Math.random() * 0.4 - 0.2; // ±20% variation
      const views = Math.max(0, Math.floor(avgDailyViews * (1 + variation)));
      
      data.push({
        date: date.toISOString().split('T')[0],
        views
      });
    }
    
    return data;
  }

  private generateEngagementTimeline(article: any) {
    const timeline = [];
    const daysSinceCreation = Math.floor(
      (Date.now() - new Date(article.createdAt).getTime()) / (24 * 60 * 60 * 1000)
    );

    for (let i = Math.min(daysSinceCreation, 30); i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      // Simulate engagement over time
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
}
