import { ProductsService } from './products.service';
import { VendorsService } from '../modules/vendors/vendors.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductFilterDto } from './dto/product-filter.dto';
import { VendorFilterDto } from './dto/vendor-filter.dto';
import { VendorKycUpdateDto } from './dto/vendor-kyc-update.dto';
import { VendorRatingUpdateDto } from './dto/vendor-rating-update.dto';
export declare class ProductsController {
    private readonly productsService;
    private readonly vendorsService;
    constructor(productsService: ProductsService, vendorsService: VendorsService);
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
    getVendors(query: VendorFilterDto): Promise<import("../modules/vendors/schemas/vendor.schema").VendorDocument[]>;
    getVendorProfile(vendorId: string): Promise<import("../modules/vendors/schemas/vendor.schema").VendorDocument>;
    getVendorProductsById(vendorId: string, filter: ProductFilterDto): Promise<import("./schemas/product.schema").ProductDocument[]>;
    getVendorAnalytics(vendorId: string, period?: string): Promise<{
        vendor: import("../modules/vendors/schemas/vendor.schema").VendorDocument;
        period: string;
        analytics: {
            salesOvertime: any[];
            topProducts: any[];
            customerInsights: any[];
            revenueBreakdown: any[];
        };
    }>;
    getVerifiedVendors(): Promise<import("../modules/vendors/schemas/vendor.schema").VendorDocument[]>;
    getTopRatedVendors(limit?: number): Promise<import("../modules/vendors/schemas/vendor.schema").VendorDocument[]>;
    getPendingVendors(): Promise<import("../modules/vendors/schemas/vendor.schema").VendorDocument[]>;
    approveVendor(vendorId: string, adminId: string): Promise<import("../modules/vendors/schemas/vendor.schema").VendorDocument>;
    rejectVendor(vendorId: string, adminId: string, reason?: string): Promise<import("../modules/vendors/schemas/vendor.schema").VendorDocument>;
    suspendVendor(vendorId: string, adminId: string, reason?: string): Promise<import("../modules/vendors/schemas/vendor.schema").VendorDocument>;
    reactivateVendor(vendorId: string, adminId: string): Promise<import("../modules/vendors/schemas/vendor.schema").VendorDocument>;
    getVendorKycStatus(vendorId: string): Promise<import("../modules/vendors/schemas/vendor.schema").VendorKycDocuments>;
    updateVendorKycStatus(vendorId: string, body: VendorKycUpdateDto, adminId: string): Promise<import("../modules/vendors/schemas/vendor.schema").VendorDocument>;
    getPendingKycVerifications(): Promise<import("../modules/vendors/schemas/vendor.schema").VendorDocument[]>;
    getVendorsByKycStatus(status: 'pending' | 'approved' | 'rejected'): Promise<import("../modules/vendors/schemas/vendor.schema").VendorDocument[]>;
    updateVendorRating(vendorId: string, body: VendorRatingUpdateDto): Promise<import("../modules/vendors/schemas/vendor.schema").VendorDocument>;
    getVendorDashboard(vendorId: string): Promise<{
        vendor: import("../modules/vendors/schemas/vendor.schema").VendorDocument;
        stats: {
            totalProducts: number;
            totalOrders: number;
            totalRevenue: number;
            averageRating: number;
        };
        recentOrders: any[];
        salesChart: any[];
    }>;
}
