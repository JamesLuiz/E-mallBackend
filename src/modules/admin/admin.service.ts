import { Injectable } from '@nestjs/common';

@Injectable()
export class AdminService {
  async getDashboardData() {
    // Mock admin dashboard data
    return {
      stats: {
        totalVendors: 150,
        totalCustomers: 5000,
        totalOrders: 1200,
        totalRevenue: 2500000,
        monthlyGrowth: {
          vendors: 12,
          customers: 25,
          orders: 18,
          revenue: 22,
        },
      },
      recentOrders: [],
      recentVendors: [],
      salesChart: [],
    };
  }

  async getPlatformAnalytics() {
    // Mock platform analytics
    return {
      analytics: {
        userGrowth: [],
        salesOvertime: [],
        topCategories: [],
        vendorPerformance: [],
        customerSegmentation: [],
      },
    };
  }

  async getAllPayments() {
    // Mock all payments data
    return {
      payments: [],
      totalAmount: 0,
      successfulPayments: 0,
      failedPayments: 0,
    };
  }
}