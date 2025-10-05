import { Document, Types } from 'mongoose';
export type ArticleDocument = Article & Document;
export declare class Comment {
    userId: Types.ObjectId;
    content: string;
    createdAt: Date;
    likes: Types.ObjectId[];
    parentCommentId?: Types.ObjectId;
}
export declare const CommentSchema: import("mongoose").Schema<Comment, import("mongoose").Model<Comment, any, any, any, Document<unknown, any, Comment> & Comment & {
    _id: Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Comment, Document<unknown, {}, import("mongoose").FlatRecord<Comment>> & import("mongoose").FlatRecord<Comment> & {
    _id: Types.ObjectId;
}>;
export declare class Repost {
    userId: Types.ObjectId;
    createdAt: Date;
    comment?: string;
}
export declare const RepostSchema: import("mongoose").Schema<Repost, import("mongoose").Model<Repost, any, any, any, Document<unknown, any, Repost> & Repost & {
    _id: Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Repost, Document<unknown, {}, import("mongoose").FlatRecord<Repost>> & import("mongoose").FlatRecord<Repost> & {
    _id: Types.ObjectId;
}>;
export declare class Article {
    title: string;
    content: string;
    authorId: Types.ObjectId;
    tags?: string[];
    image?: string;
    likes: Types.ObjectId[];
    comments: Comment[];
    reposts: Repost[];
    shares: Types.ObjectId[];
    mentions: Types.ObjectId[];
    viewCount: number;
    isRepost: boolean;
    originalArticleId?: Types.ObjectId;
    status: 'draft' | 'published' | 'archived';
    publishedAt?: Date;
    trendingScore: number;
}
export declare const ArticleSchema: import("mongoose").Schema<Article, import("mongoose").Model<Article, any, any, any, Document<unknown, any, Article> & Article & {
    _id: Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Article, Document<unknown, {}, import("mongoose").FlatRecord<Article>> & import("mongoose").FlatRecord<Article> & {
    _id: Types.ObjectId;
}>;
