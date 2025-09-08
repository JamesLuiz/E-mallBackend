export declare class AdminService {
    getDashboardData(): Promise<{
        stats: {
            totalVendors: number;
            totalCustomers: number;
            totalOrders: number;
            totalRevenue: number;
            monthlyGrowth: {
                vendors: number;
                customers: number;
                orders: number;
                revenue: number;
            };
        };
        recentOrders: any[];
        recentVendors: any[];
        salesChart: any[];
    }>;
    getPlatformAnalytics(): Promise<{
        analytics: {
            userGrowth: any[];
            salesOvertime: any[];
            topCategories: any[];
            vendorPerformance: any[];
            customerSegmentation: any[];
        };
    }>;
    getAllPayments(): Promise<{
        payments: any[];
        totalAmount: number;
        successfulPayments: number;
        failedPayments: number;
    }>;
}
