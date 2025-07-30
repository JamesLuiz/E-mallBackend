import { Document, Types } from 'mongoose';
export type VendorDocument = Vendor & Document;
export declare class StoreSettings {
    logo: string;
    banner: string;
    primaryColor: string;
    description: string;
    socialLinks: Record<string, string>;
}
export declare class Subscription {
    plan: string;
    status: string;
    startDate: Date;
    endDate: Date;
    amount: number;
}
export declare class Vendor {
    userId: Types.ObjectId;
    businessName: string;
    businessDescription: string;
    businessAddress: string;
    storeSettings: StoreSettings;
    subscription: Subscription;
    verified: boolean;
    rating: number;
    totalSales: number;
}
export declare const VendorSchema: import("mongoose").Schema<Vendor, import("mongoose").Model<Vendor, any, any, any, Document<unknown, any, Vendor> & Vendor & {
    _id: Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Vendor, Document<unknown, {}, import("mongoose").FlatRecord<Vendor>> & import("mongoose").FlatRecord<Vendor> & {
    _id: Types.ObjectId;
}>;
