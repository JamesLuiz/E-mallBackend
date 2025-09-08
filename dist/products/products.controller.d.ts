import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductFilterDto } from './dto/product-filter.dto';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    findAll(filter: ProductFilterDto): Promise<import("./schemas/product.schema").ProductDocument[]>;
    create(userId: string, createProductDto: CreateProductDto): Promise<import("./schemas/product.schema").ProductDocument>;
    getCategories(): Promise<string[]>;
    search(searchTerm: string, filter: ProductFilterDto): Promise<import("./schemas/product.schema").ProductDocument[]>;
    getFeatured(limit?: number): Promise<import("./schemas/product.schema").ProductDocument[]>;
    getTrending(limit?: number): Promise<import("./schemas/product.schema").ProductDocument[]>;
    getNewArrivals(limit?: number): Promise<import("./schemas/product.schema").ProductDocument[]>;
    getTopRated(limit?: number): Promise<import("./schemas/product.schema").ProductDocument[]>;
    getOnSale(limit?: number): Promise<import("./schemas/product.schema").ProductDocument[]>;
    getByCategory(category: string, filter: ProductFilterDto): Promise<import("./schemas/product.schema").ProductDocument[]>;
    getMyProducts(userId: string, filter: ProductFilterDto): Promise<import("./schemas/product.schema").ProductDocument[]>;
    getVendorStats(userId: string): Promise<any>;
    getLowStockProducts(userId: string): Promise<import("./schemas/product.schema").ProductDocument[]>;
    getVendorProducts(vendorId: string, filter: ProductFilterDto): Promise<import("./schemas/product.schema").ProductDocument[]>;
    findOne(id: string): Promise<import("./schemas/product.schema").ProductDocument>;
    getRelatedProducts(id: string, limit?: number): Promise<import("./schemas/product.schema").ProductDocument[]>;
    getProductStats(id: string): Promise<any>;
    getProductImages(id: string): Promise<import("./schemas/product.schema").ProductImage[]>;
    update(id: string, userId: string, updateProductDto: UpdateProductDto): Promise<import("./schemas/product.schema").ProductDocument>;
    toggleFeatured(id: string, userId: string): Promise<import("./schemas/product.schema").ProductDocument>;
    incrementViews(id: string): Promise<void>;
    bulkUpdateStatus(userId: string, body: {
        productIds: string[];
        status: string;
    }): Promise<{
        updated: number;
    }>;
    duplicateProduct(id: string, userId: string): Promise<import("./schemas/product.schema").ProductDocument>;
    remove(id: string, userId: string): Promise<void>;
    uploadImages(id: string, files: Array<Express.Multer.File>, userId: string): Promise<import("./schemas/product.schema").ProductDocument>;
    setPrimaryImage(id: string, imageHash: string, userId: string): Promise<import("./schemas/product.schema").ProductDocument>;
    removeProductImage(id: string, imageHash: string, userId: string): Promise<import("./schemas/product.schema").ProductDocument>;
}
