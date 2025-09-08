"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const user_role_enum_1 = require("../../common/enums/user-role.enum");
const admin_service_1 = require("./admin.service");
const vendors_service_1 = require("../vendors/vendors.service");
const orders_service_1 = require("../orders/orders.service");
let AdminController = class AdminController {
    constructor(adminService, vendorsService, ordersService) {
        this.adminService = adminService;
        this.vendorsService = vendorsService;
        this.ordersService = ordersService;
    }
    getDashboard() {
        return this.adminService.getDashboardData();
    }
    getAllVendors() {
        return this.vendorsService.findAll();
    }
    getAllOrders() {
        return this.ordersService.findAll();
    }
    getAnalytics() {
        return this.adminService.getPlatformAnalytics();
    }
    getAllPayments() {
        return this.adminService.getAllPayments();
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Get)('dashboard'),
    (0, swagger_1.ApiOperation)({ summary: 'Get admin dashboard data' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getDashboard", null);
__decorate([
    (0, common_1.Get)('vendors'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all vendors' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getAllVendors", null);
__decorate([
    (0, common_1.Get)('orders'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all orders' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getAllOrders", null);
__decorate([
    (0, common_1.Get)('analytics'),
    (0, swagger_1.ApiOperation)({ summary: 'Get platform analytics' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getAnalytics", null);
__decorate([
    (0, common_1.Get)('payments'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all payment transactions' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getAllPayments", null);
exports.AdminController = AdminController = __decorate([
    (0, swagger_1.ApiTags)('Admin'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN),
    (0, common_1.Controller)('admin'),
    __metadata("design:paramtypes", [admin_service_1.AdminService,
        vendors_service_1.VendorsService,
        orders_service_1.OrdersService])
], AdminController);
//# sourceMappingURL=admin.controller.js.map