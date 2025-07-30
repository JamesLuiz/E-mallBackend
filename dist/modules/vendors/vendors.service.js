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
exports.VendorsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const vendor_schema_1 = require("./schemas/vendor.schema");
let VendorsService = class VendorsService {
    constructor(vendorModel) {
        this.vendorModel = vendorModel;
    }
    async create(userId, createVendorDto) {
        const existingVendor = await this.vendorModel.findOne({ userId });
        if (existingVendor) {
            throw new common_1.ForbiddenException('User already has a vendor profile');
        }
        const createdVendor = new this.vendorModel({
            userId,
            ...createVendorDto,
        });
        return createdVendor.save();
    }
    async findAll() {
        return this.vendorModel.find({ verified: true }).populate('userId', 'email profile').exec();
    }
    async findOne(id) {
        const vendor = await this.vendorModel.findById(id).populate('userId', 'email profile').exec();
        if (!vendor) {
            throw new common_1.NotFoundException('Vendor not found');
        }
        return vendor;
    }
    async findByUserId(userId) {
        const vendor = await this.vendorModel.findOne({ userId }).populate('userId', 'email profile').exec();
        if (!vendor) {
            throw new common_1.NotFoundException('Vendor profile not found');
        }
        return vendor;
    }
    async update(id, updateVendorDto) {
        const updatedVendor = await this.vendorModel
            .findByIdAndUpdate(id, updateVendorDto, { new: true, runValidators: true })
            .populate('userId', 'email profile')
            .exec();
        if (!updatedVendor) {
            throw new common_1.NotFoundException('Vendor not found');
        }
        return updatedVendor;
    }
    async approve(id) {
        const vendor = await this.vendorModel
            .findByIdAndUpdate(id, { verified: true }, { new: true })
            .exec();
        if (!vendor) {
            throw new common_1.NotFoundException('Vendor not found');
        }
        return vendor;
    }
    async getDashboardData(userId) {
        const vendor = await this.findByUserId(userId);
        return {
            vendor,
            stats: {
                totalProducts: 0,
                totalOrders: 0,
                totalRevenue: 0,
                averageRating: vendor.rating,
            },
            recentOrders: [],
            salesChart: [],
        };
    }
    async getAnalytics(userId) {
        const vendor = await this.findByUserId(userId);
        return {
            vendor,
            analytics: {
                salesOvertime: [],
                topProducts: [],
                customerInsights: [],
                revenueBreakdown: [],
            },
        };
    }
};
exports.VendorsService = VendorsService;
exports.VendorsService = VendorsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(vendor_schema_1.Vendor.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], VendorsService);
//# sourceMappingURL=vendors.service.js.map