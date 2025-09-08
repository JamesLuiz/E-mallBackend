export declare class VendorFilterDto {
    search?: string;
    verified?: boolean;
    verificationStatus?: 'pending' | 'approved' | 'rejected';
    minRating?: number;
    maxRating?: number;
    city?: string;
    state?: string;
    sortBy?: 'businessName' | 'rating' | 'totalSales' | 'createdAt';
    sortOrder?: 'asc' | 'desc';
    page?: number;
    limit?: number;
}
