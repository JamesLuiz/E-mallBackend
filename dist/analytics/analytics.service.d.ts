import { AnalyticsQueryDto } from './dto/analytics-query.dto';
export declare class AnalyticsService {
    getDashboard(query: AnalyticsQueryDto): Promise<{
        totalUsers: number;
        totalOrders: number;
        totalRevenue: number;
        topVendors: any[];
        topProducts: any[];
    }>;
    getSales(query: AnalyticsQueryDto): Promise<{
        sales: any[];
        total: number;
        period: string;
    }>;
    getProducts(query: AnalyticsQueryDto): Promise<{
        products: any[];
        topCategories: any[];
    }>;
    getCustomers(query: AnalyticsQueryDto): Promise<{
        customers: any[];
        newCustomers: number;
    }>;
}
