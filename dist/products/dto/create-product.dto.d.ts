declare class InventoryDto {
    stock: number;
    lowStockAlert?: number;
}
export declare class CreateProductDto {
    name: string;
    description: string;
    category: string;
    subcategory?: string;
    price: number;
    discount?: number;
    images?: string[];
    inventory: InventoryDto;
    specifications?: Record<string, any>;
    isActive?: boolean;
    seoTitle?: string;
    seoDescription?: string;
    tags?: string[];
    featured?: boolean;
    status?: string;
}
export {};
