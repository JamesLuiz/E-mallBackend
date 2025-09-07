import { VendorsService } from './vendors.service';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import { VendorResponseDto } from './dto/vendor-response.dto';
import { VendorQueryDto } from './dto/vendor-query.dto';
export declare class VendorsController {
    private readonly vendorsService;
    constructor(vendorsService: VendorsService);
    create(userId: string, createVendorDto: CreateVendorDto): Promise<VendorResponseDto>;
    findAll(query: VendorQueryDto): Promise<VendorResponseDto[]>;
    getProfile(userId: string): Promise<VendorResponseDto>;
    updateProfile(userId: string, updateVendorDto: UpdateVendorDto): Promise<VendorResponseDto>;
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
    getAnalytics(userId: string, period?: string): Promise<{
        vendor: import("./schemas/vendor.schema").VendorDocument;
        period: string;
        analytics: {
            salesOvertime: any[];
            topProducts: any[];
            customerInsights: any[];
            revenueBreakdown: any[];
        };
    }>;
    getPendingVendors(): Promise<VendorResponseDto[]>;
    approve(id: string, adminId: string): Promise<VendorResponseDto>;
    reject(id: string, adminId: string, reason?: string): Promise<VendorResponseDto>;
    suspend(id: string, adminId: string, reason?: string): Promise<VendorResponseDto>;
    reactivate(id: string, adminId: string): Promise<VendorResponseDto>;
    findOne(id: string): Promise<VendorResponseDto>;
    remove(id: string, adminId: string): Promise<void>;
}
