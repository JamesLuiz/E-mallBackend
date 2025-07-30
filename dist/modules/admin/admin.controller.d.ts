import { AdminService } from './admin.service';
import { VendorsService } from '../vendors/vendors.service';
import { OrdersService } from '../orders/orders.service';
export declare class AdminController {
    private readonly adminService;
    private readonly vendorsService;
    private readonly ordersService;
    constructor(adminService: AdminService, vendorsService: VendorsService, ordersService: OrdersService);
    getDashboard(): Promise<{
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
    getAllVendors(): Promise<import("../vendors/schemas/vendor.schema").Vendor[]>;
    getAllOrders(): Promise<import("../orders/schemas/order.schema").Order[]>;
    getAnalytics(): Promise<{
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
