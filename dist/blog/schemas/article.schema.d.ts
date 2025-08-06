import { Document, Types } from 'mongoose';
export type ArticleDocument = Article & Document;
export declare class Article {
    title: string;
    content: string;
    authorId: Types.ObjectId;
    tags?: string[];
    image?: string;
}
export declare const ArticleSchema: import("mongoose").Schema<Article, import("mongoose").Model<Article, any, any, any, Document<unknown, any, Article> & Article & {
    _id: Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Article, Document<unknown, {}, import("mongoose").FlatRecord<Article>> & import("mongoose").FlatRecord<Article> & {
    _id: Types.ObjectId;
}>;
