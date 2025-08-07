export declare class VendorResponseDto {
    id: string;
    businessName: string;
    businessDescription: string;
    businessAddress: string;
    storeSettings: {
        logo?: string;
        logoUri?: string;
        banner?: string;
        bannerUri?: string;
        primaryColor?: string;
        description?: string;
        socialLinks?: Record<string, string>;
    };
    verified: boolean;
    rating: number;
    totalSales: number;
    userEmail: string;
    userProfile: any;
    createdAt: Date;
    updatedAt: Date;
    kycDocuments: any;
    userId: any;
}
