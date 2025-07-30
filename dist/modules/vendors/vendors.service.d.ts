import { Model } from 'mongoose';
import { Vendor, VendorDocument } from './schemas/vendor.schema';
import { CreateVendorDto } from './dto/create-vendor.dto';
export declare class VendorsService {
    private vendorModel;
    constructor(vendorModel: Model<VendorDocument>);
    create(userId: string, createVendorDto: CreateVendorDto): Promise<Vendor>;
    findAll(): Promise<Vendor[]>;
    findOne(id: string): Promise<Vendor>;
    findByUserId(userId: string): Promise<Vendor>;
    update(id: string, updateVendorDto: Partial<CreateVendorDto>): Promise<Vendor>;
    approve(id: string): Promise<Vendor>;
    getDashboardData(userId: string): Promise<{
        vendor: Vendor;
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
        vendor: Vendor;
        analytics: {
            salesOvertime: any[];
            topProducts: any[];
            customerInsights: any[];
            revenueBreakdown: any[];
        };
    }>;
}
