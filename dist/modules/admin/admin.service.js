"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
let AdminService = class AdminService {
    async getDashboardData() {
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
        return {
            payments: [],
            totalAmount: 0,
            successfulPayments: 0,
            failedPayments: 0,
        };
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)()
], AdminService);
//# sourceMappingURL=admin.service.js.map