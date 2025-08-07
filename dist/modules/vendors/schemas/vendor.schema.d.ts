import { Document, Types } from 'mongoose';
export type VendorDocument = Vendor & Document;
export declare class StoreSettings {
    logo: string;
    logoUri: string;
    logoHash: string;
    banner: string;
    bannerUri: string;
    bannerHash: string;
    primaryColor: string;
    description: string;
    socialLinks: Record<string, string>;
}
export declare class VendorKycDocuments {
    identityDocumentType: string;
    identityDocumentUri: string;
    identityDocumentHash: string;
    businessCertificateUri: string;
    businessCertificateHash: string;
    taxCertificateUri: string;
    taxCertificateHash: string;
    bankStatementUri: string;
    bankStatementHash: string;
    verificationStatus: 'pending' | 'approved' | 'rejected';
    verificationNotes: string;
    submittedAt: Date;
    verifiedAt: Date;
    verifiedBy: string;
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
    kycDocuments: VendorKycDocuments;
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
