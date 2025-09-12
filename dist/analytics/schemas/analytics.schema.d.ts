import { Document } from 'mongoose';
export type AnalyticsDocument = Analytics & Document;
export declare class Analytics {
    dashboard?: Record<string, any>;
    sales?: Record<string, any>;
    products?: Record<string, any>;
    customers?: Record<string, any>;
}
export declare const AnalyticsSchema: import("mongoose").Schema<Analytics, import("mongoose").Model<Analytics, any, any, any, Document<unknown, any, Analytics> & Analytics & {
    _id: import("mongoose").Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Analytics, Document<unknown, {}, import("mongoose").FlatRecord<Analytics>> & import("mongoose").FlatRecord<Analytics> & {
    _id: import("mongoose").Types.ObjectId;
}>;
