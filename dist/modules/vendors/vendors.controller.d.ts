import { VendorsService } from './vendors.service';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { VendorBioDto } from './dto/vendor-bio.dto';
import { VendorCompanyDto } from './dto/vendor-company.dto';
import { VendorKycDto } from './dto/vendor-kyc.dto';
export declare class VendorsController {
    private readonly vendorsService;
    constructor(vendorsService: VendorsService);
    create(userId: string, createVendorDto: CreateVendorDto): Promise<import("./schemas/vendor.schema").VendorDocument>;
    findAll(): Promise<import("./schemas/vendor.schema").VendorDocument[]>;
    getProfile(userId: string): Promise<import("./schemas/vendor.schema").VendorDocument>;
    updateProfile(userId: string, updateVendorDto: any): Promise<import("./schemas/vendor.schema").VendorDocument>;
    getDashboard(userId: string): Promise<{
        vendor: import("./schemas/vendor.schema").VendorDocument;
        stats: {
            totalProducts: number;
            totalOrders: number;
            totalRevenue: number;
            averageRating: number;
        };
        recentOrders: any[];
        salesChart: any[];
    }>;
    getAnalytics(userId: string): Promise<{
        vendor: import("./schemas/vendor.schema").VendorDocument;
        period: string;
        analytics: {
            salesOvertime: any[];
            topProducts: any[];
            customerInsights: any[];
            revenueBreakdown: any[];
        };
    }>;
    approve(id: string): Promise<import("./schemas/vendor.schema").VendorDocument>;
    findOne(id: string): Promise<import("./schemas/vendor.schema").VendorDocument>;
    kycBioData(userId: string, bioDto: VendorBioDto): Promise<import("mongoose").Document<unknown, {}, import("./schemas/vendor.schema").VendorDocument> & import("./schemas/vendor.schema").Vendor & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    kycCompanyInfo(userId: string, companyDto: VendorCompanyDto): Promise<import("mongoose").Document<unknown, {}, import("./schemas/vendor.schema").VendorDocument> & import("./schemas/vendor.schema").Vendor & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    kycDocuments(userId: string, files: Array<Express.Multer.File>, kycDto: VendorKycDto): Promise<import("mongoose").Document<unknown, {}, import("./schemas/vendor.schema").VendorDocument> & import("./schemas/vendor.schema").Vendor & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    getVendorProducts(vendorId: string, page?: number, limit?: number, status?: string, category?: string): Promise<{
        vendorId: string;
        products: any[];
        pagination: {
            page: number;
            limit: number;
            total: number;
        };
    }>;
}
