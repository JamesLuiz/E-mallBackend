import { VendorsService } from './vendors.service';
import { CreateVendorDto } from './dto/create-vendor.dto';
export declare class VendorsController {
    private readonly vendorsService;
    constructor(vendorsService: VendorsService);
    create(userId: string, createVendorDto: CreateVendorDto): Promise<import("./schemas/vendor.schema").Vendor>;
    findAll(): Promise<import("./schemas/vendor.schema").Vendor[]>;
    getProfile(userId: string): Promise<import("./schemas/vendor.schema").Vendor>;
    updateProfile(userId: string, updateVendorDto: Partial<CreateVendorDto>): Promise<import("./schemas/vendor.schema").Vendor>;
    getDashboard(userId: string): Promise<{
        vendor: import("./schemas/vendor.schema").Vendor;
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
        vendor: import("./schemas/vendor.schema").Vendor;
        analytics: {
            salesOvertime: any[];
            topProducts: any[];
            customerInsights: any[];
            revenueBreakdown: any[];
        };
    }>;
    approve(id: string): Promise<import("./schemas/vendor.schema").Vendor>;
    findOne(id: string): Promise<import("./schemas/vendor.schema").Vendor>;
}
