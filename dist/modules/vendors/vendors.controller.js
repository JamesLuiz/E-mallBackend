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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VendorsController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const user_role_enum_1 = require("../../common/enums/user-role.enum");
const vendors_service_1 = require("./vendors.service");
const create_vendor_dto_1 = require("./dto/create-vendor.dto");
const vendor_bio_dto_1 = require("./dto/vendor-bio.dto");
const vendor_company_dto_1 = require("./dto/vendor-company.dto");
const vendor_kyc_dto_1 = require("./dto/vendor-kyc.dto");
let VendorsController = class VendorsController {
    constructor(vendorsService) {
        this.vendorsService = vendorsService;
    }
    create(userId, createVendorDto) {
        return this.vendorsService.create(userId, createVendorDto.businessName);
    }
    findAll() {
        return this.vendorsService.findAll();
    }
    getProfile(userId) {
        return this.vendorsService.findByUserId(userId);
    }
    async updateProfile(userId, updateVendorDto) {
        return this.vendorsService.updateByUserId(userId, updateVendorDto);
    }
    getDashboard(userId) {
        return this.vendorsService.getDashboardData(userId);
    }
    getAnalytics(userId) {
        return this.vendorsService.getAnalytics(userId);
    }
    approve(id) {
        return this.vendorsService.approve(id);
    }
    findOne(id) {
        return this.vendorsService.findOne(id);
    }
    async kycBioData(userId, bioDto) {
        return this.vendorsService.kycBioData(userId, bioDto);
    }
    async kycCompanyInfo(userId, companyDto) {
        return this.vendorsService.kycCompanyInfo(userId, companyDto);
    }
    async kycDocuments(userId, files, kycDto) {
        return this.vendorsService.kycDocuments(userId, files, kycDto);
    }
    async getVendorProducts(vendorId, page, limit, status, category) {
        return this.vendorsService.getVendorProducts(vendorId, { page, limit, status, category });
    }
};
exports.VendorsController = VendorsController;
__decorate([
    (0, common_1.Post)('register'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.VENDOR, user_role_enum_1.UserRole.CUSTOMER),
    (0, swagger_1.ApiOperation)({ summary: 'Register as vendor' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('_id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_vendor_dto_1.CreateVendorDto]),
    __metadata("design:returntype", void 0)
], VendorsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all verified vendors' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], VendorsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('profile'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.VENDOR),
    (0, swagger_1.ApiOperation)({ summary: 'Get vendor profile' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], VendorsController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Put)('profile'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.VENDOR),
    (0, swagger_1.ApiOperation)({ summary: 'Update vendor profile' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('_id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], VendorsController.prototype, "updateProfile", null);
__decorate([
    (0, common_1.Get)('dashboard'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.VENDOR),
    (0, swagger_1.ApiOperation)({ summary: 'Get vendor dashboard data' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], VendorsController.prototype, "getDashboard", null);
__decorate([
    (0, common_1.Get)('analytics'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.VENDOR),
    (0, swagger_1.ApiOperation)({ summary: 'Get vendor analytics' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], VendorsController.prototype, "getAnalytics", null);
__decorate([
    (0, common_1.Put)(':id/approve'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Approve vendor (Admin only)' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], VendorsController.prototype, "approve", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get vendor by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], VendorsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)('kyc/bio-data'),
    (0, swagger_1.ApiOperation)({ summary: 'Submit vendor KYC bio-data' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('_id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, vendor_bio_dto_1.VendorBioDto]),
    __metadata("design:returntype", Promise)
], VendorsController.prototype, "kycBioData", null);
__decorate([
    (0, common_1.Post)('kyc/company-info'),
    (0, swagger_1.ApiOperation)({ summary: 'Submit vendor KYC company info' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('_id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, vendor_company_dto_1.VendorCompanyDto]),
    __metadata("design:returntype", Promise)
], VendorsController.prototype, "kycCompanyInfo", null);
__decorate([
    (0, common_1.Post)('kyc/documents'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('documents')),
    (0, swagger_1.ApiOperation)({ summary: 'Submit vendor KYC documents' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('_id')),
    __param(1, (0, common_1.UploadedFiles)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array,
        vendor_kyc_dto_1.VendorKycDto]),
    __metadata("design:returntype", Promise)
], VendorsController.prototype, "kycDocuments", null);
__decorate([
    (0, common_1.Get)(':vendorId/products'),
    (0, swagger_1.ApiOperation)({ summary: 'Get products for a vendor' }),
    __param(0, (0, common_1.Param)('vendorId')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __param(3, (0, common_1.Query)('status')),
    __param(4, (0, common_1.Query)('category')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number, String, String]),
    __metadata("design:returntype", Promise)
], VendorsController.prototype, "getVendorProducts", null);
exports.VendorsController = VendorsController = __decorate([
    (0, swagger_1.ApiTags)('Vendors'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('vendors'),
    __metadata("design:paramtypes", [vendors_service_1.VendorsService])
], VendorsController);
//# sourceMappingURL=vendors.controller.js.map