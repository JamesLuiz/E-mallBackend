import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ArticleDocument = Article & Document;

// Comment schema
@Schema({ _id: true })
export class Comment {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  content: string;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: [Types.ObjectId], ref: 'User', default: [] })
  likes: Types.ObjectId[];

  @Prop({ type: Types.ObjectId, ref: 'Comment' })
  parentCommentId?: Types.ObjectId; // For replies
}

export const CommentSchema = SchemaFactory.createForClass(Comment);

// Repost schema
@Schema({ _id: true })
export class Repost {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop()
  comment?: string; // Optional comment when reposting
}

export const RepostSchema = SchemaFactory.createForClass(Repost);

@Schema({ timestamps: true })
export class Article {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  authorId: Types.ObjectId;

  @Prop({ type: [String] })
  tags?: string[];

  @Prop()
  image?: string;

  // Social features
  @Prop({ type: [Types.ObjectId], ref: 'User', default: [] })
  likes: Types.ObjectId[];

  @Prop({ type: [CommentSchema], default: [] })
  comments: Comment[];

  @Prop({ type: [RepostSchema], default: [] })
  reposts: Repost[];

  @Prop({ type: [Types.ObjectId], ref: 'User', default: [] })
  shares: Types.ObjectId[];

  @Prop({ type: [Types.ObjectId], ref: 'User', default: [] })
  mentions: Types.ObjectId[]; // Users mentioned in the article

  @Prop({ default: 0 })
  viewCount: number;

  @Prop({ default: false })
  isRepost: boolean;

  @Prop({ type: Types.ObjectId, ref: 'Article' })
  originalArticleId?: Types.ObjectId; // For reposts

  @Prop({ default: 'draft' })
  status: 'draft' | 'published' | 'archived';

  @Prop({ type: Date })
  publishedAt?: Date;

  @Prop({ default: 0 })
  trendingScore: number; // For trending algorithm

  // Timestamps (automatically added by Mongoose when timestamps: true)
  @Prop({ type: Date })
  createdAt: Date;

  @Prop({ type: Date })
  updatedAt: Date;
}

export const ArticleSchema = SchemaFactory.createForClass(Article);