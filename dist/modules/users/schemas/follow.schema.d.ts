import { Document, Types } from 'mongoose';
export type FollowDocument = Follow & Document;
export declare class Follow {
    followerId: Types.ObjectId;
    followingId: Types.ObjectId;
    followedAt: Date;
}
export declare const FollowSchema: import("mongoose").Schema<Follow, import("mongoose").Model<Follow, any, any, any, Document<unknown, any, Follow> & Follow & {
    _id: Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Follow, Document<unknown, {}, import("mongoose").FlatRecord<Follow>> & import("mongoose").FlatRecord<Follow> & {
    _id: Types.ObjectId;
}>;
