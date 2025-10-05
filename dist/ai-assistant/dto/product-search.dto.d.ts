export declare class ProductSearchDto {
    query: string;
    category?: string;
    limit?: number;
    sortBy?: 'price' | 'rating' | 'name' | 'createdAt';
    sortOrder?: 'asc' | 'desc';
}
