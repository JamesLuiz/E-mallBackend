import { Document, Types } from 'mongoose';
export type ProductDocument = Product & Document;
export declare class Inventory {
    stock: number;
    lowStockAlert: number;
}
export declare class Product {
    vendorId: Types.ObjectId;
    name: string;
    description: string;
    category: string;
    subcategory: string;
    price: number;
    discount: number;
    images: string[];
    inventory: Inventory;
    specifications: Record<string, any>;
    isActive: boolean;
    seoTitle: string;
    seoDescription: string;
    tags: string[];
    ratings: number;
    reviewCount: number;
}
export declare const ProductSchema: import("mongoose").Schema<Product, import("mongoose").Model<Product, any, any, any, Document<unknown, any, Product> & Product & {
    _id: Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Product, Document<unknown, {}, import("mongoose").FlatRecord<Product>> & import("mongoose").FlatRecord<Product> & {
    _id: Types.ObjectId;
}>;
