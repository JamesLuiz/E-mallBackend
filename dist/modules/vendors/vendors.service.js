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
const minio_service_1 = require("../minio/minio.service");
let VendorsService = class VendorsService {
    constructor(vendorModel, minioService) {
        this.vendorModel = vendorModel;
        this.minioService = minioService;
    }
    async create(userId, businessName) {
        const existingVendor = await this.vendorModel.findOne({ userId });
        if (existingVendor) {
            throw new common_1.ForbiddenException('User already has a vendor account');
        }
        const vendor = new this.vendorModel({
            userId,
            businessName,
        });
        const savedVendor = await vendor.save();
        return this.vendorModel
            .findById(savedVendor._id)
            .populate('userId', 'email profile')
            .exec();
    }
    async findAll(query) {
        const filter = {};
        const sort = {};
        if (query) {
            if (query.search) {
                filter.$or = [
                    { businessName: { $regex: query.search, $options: 'i' } },
                    { businessDescription: { $regex: query.search, $options: 'i' } },
                ];
            }
            if (query.verified !== undefined) {
                filter.verified = query.verified;
            }
            if (query.verificationStatus) {
                filter['kycDocuments.verificationStatus'] = query.verificationStatus;
            }
            if (query.minRating !== undefined) {
                filter.rating = { ...filter.rating, $gte: query.minRating };
            }
            if (query.maxRating !== undefined) {
                filter.rating = { ...filter.rating, $lte: query.maxRating };
            }
            if (query.city) {
                filter.businessAddress = { $regex: query.city, $options: 'i' };
            }
            if (query.sortBy) {
                sort[query.sortBy] = query.sortOrder === 'desc' ? -1 : 1;
            }
            else {
                sort.createdAt = -1;
            }
        }
        const queryBuilder = this.vendorModel
            .find(filter)
            .populate('userId', 'email profile')
            .sort(sort);
        if (query?.page && query?.limit) {
            const skip = (query.page - 1) * query.limit;
            queryBuilder.skip(skip).limit(query.limit);
        }
        return queryBuilder.exec();
    }
    async findOne(id) {
        const vendor = await this.vendorModel
            .findById(id)
            .populate('userId', 'email profile')
            .exec();
        if (!vendor) {
            throw new common_1.NotFoundException('Vendor not found');
        }
        return vendor;
    }
    async findByUserId(userId) {
        const vendor = await this.vendorModel
            .findOne({ userId })
            .populate('userId', 'email profile')
            .exec();
        if (!vendor) {
            throw new common_1.NotFoundException('Vendor not found');
        }
        return vendor;
    }
    async update(id, updateVendorDto) {
        const updatedVendor = await this.vendorModel
            .findByIdAndUpdate(id, updateVendorDto, { new: true })
            .populate('userId', 'email profile')
            .exec();
        if (!updatedVendor) {
            throw new common_1.NotFoundException('Vendor not found');
        }
        return updatedVendor;
    }
    async updateByUserId(userId, updateVendorDto) {
        const updatedVendor = await this.vendorModel
            .findOneAndUpdate({ userId }, updateVendorDto, { new: true })
            .populate('userId', 'email profile')
            .exec();
        if (!updatedVendor) {
            throw new common_1.NotFoundException('Vendor not found');
        }
        return updatedVendor;
    }
    async remove(id, adminId) {
        const result = await this.vendorModel.findByIdAndDelete(id).exec();
        if (!result) {
            throw new common_1.NotFoundException('Vendor not found');
        }
    }
    async getVerified() {
        return this.vendorModel
            .find({ verified: true })
            .populate('userId', 'email profile')
            .exec();
    }
    async findPendingVendors() {
        return this.vendorModel
            .find({ 'kycDocuments.verificationStatus': 'pending' })
            .populate('userId', 'email profile')
            .exec();
    }
    async approve(id, adminId) {
        const vendor = await this.vendorModel
            .findByIdAndUpdate(id, {
            verified: true,
            'kycDocuments.verificationStatus': 'approved',
            'kycDocuments.verifiedAt': new Date()
        }, { new: true })
            .populate('userId', 'email profile')
            .exec();
        if (!vendor) {
            throw new common_1.NotFoundException('Vendor not found');
        }
        return vendor;
    }
    async reject(id, adminId, reason) {
        const vendor = await this.vendorModel
            .findByIdAndUpdate(id, {
            verified: false,
            'kycDocuments.verificationStatus': 'rejected',
            'kycDocuments.verificationNotes': reason,
            'kycDocuments.verifiedAt': new Date()
        }, { new: true })
            .populate('userId', 'email profile')
            .exec();
        if (!vendor) {
            throw new common_1.NotFoundException('Vendor not found');
        }
        return vendor;
    }
    async suspend(id, adminId, reason) {
        const vendor = await this.vendorModel
            .findByIdAndUpdate(id, {
            verified: false,
        }, { new: true })
            .populate('userId', 'email profile')
            .exec();
        if (!vendor) {
            throw new common_1.NotFoundException('Vendor not found');
        }
        return vendor;
    }
    async reactivate(id, adminId) {
        const vendor = await this.vendorModel
            .findByIdAndUpdate(id, {
            verified: true,
        }, { new: true })
            .populate('userId', 'email profile')
            .exec();
        if (!vendor) {
            throw new common_1.NotFoundException('Vendor not found');
        }
        return vendor;
    }
    async getTopRated(limit = 10) {
        return this.vendorModel
            .find({ verified: true })
            .sort({ rating: -1 })
            .limit(limit)
            .populate('userId', 'email profile')
            .exec();
    }
    async updateRating(vendorId, newRating) {
        const vendor = await this.vendorModel.findByIdAndUpdate(vendorId, { rating: newRating }, { new: true });
        if (!vendor)
            throw new common_1.NotFoundException('Vendor not found');
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
    async getAnalytics(userId, period) {
        const vendor = await this.findByUserId(userId);
        return {
            vendor,
            period: period || 'month',
            analytics: {
                salesOvertime: [],
                topProducts: [],
                customerInsights: [],
                revenueBreakdown: [],
            },
        };
    }
    async getVendorProducts(vendorId, query) {
        return {
            vendorId,
            products: [],
            pagination: { page: query.page || 1, limit: query.limit || 10, total: 0 },
        };
    }
    async kycBioData(userId, bioDto) {
        const vendor = await this.vendorModel.findOneAndUpdate({ userId }, { $set: { bioData: bioDto } }, { new: true });
        if (!vendor)
            throw new common_1.NotFoundException('Vendor not found');
        return vendor;
    }
    async kycCompanyInfo(userId, companyDto) {
        const vendor = await this.vendorModel.findOneAndUpdate({ userId }, { $set: { companyInfo: companyDto } }, { new: true });
        if (!vendor)
            throw new common_1.NotFoundException('Vendor not found');
        return vendor;
    }
    async kycDocuments(userId, files, kycDto) {
        const fileUrls = files.map(f => `uploads/kyc/${f.filename || f.originalname}`);
        const vendor = await this.vendorModel.findOneAndUpdate({ userId }, { $set: { kycDocuments: { ...kycDto, files: fileUrls } } }, { new: true });
        if (!vendor)
            throw new common_1.NotFoundException('Vendor not found');
        return vendor;
    }
    async updateVendorLogo(userId, uploadResult) {
        const vendor = await this.vendorModel.findOneAndUpdate({ userId }, {
            $set: {
                'storeSettings.logoUri': uploadResult.uri,
                'storeSettings.logoHash': uploadResult.hash,
                'storeSettings.logo': uploadResult.uri,
            },
        }, { new: true, runValidators: true }).populate('userId', 'email profile').exec();
        if (!vendor) {
            throw new common_1.NotFoundException('Vendor not found');
        }
        return vendor;
    }
    async updateVendorBanner(userId, uploadResult) {
        const vendor = await this.vendorModel.findOneAndUpdate({ userId }, {
            $set: {
                'storeSettings.bannerUri': uploadResult.uri,
                'storeSettings.bannerHash': uploadResult.hash,
                'storeSettings.banner': uploadResult.uri,
            },
        }, { new: true, runValidators: true }).populate('userId', 'email profile').exec();
        if (!vendor) {
            throw new common_1.NotFoundException('Vendor not found');
        }
        return vendor;
    }
    async uploadVendorKycDocument(userId, documentType, uploadResult) {
        const updateData = {
            'kycDocuments.submittedAt': new Date(),
            'kycDocuments.verificationStatus': 'pending',
        };
        switch (documentType) {
            case 'identity':
                updateData['kycDocuments.identityDocumentUri'] = uploadResult.uri;
                updateData['kycDocuments.identityDocumentHash'] = uploadResult.hash;
                break;
            case 'businessCertificate':
                updateData['kycDocuments.businessCertificateUri'] = uploadResult.uri;
                updateData['kycDocuments.businessCertificateHash'] = uploadResult.hash;
                break;
            case 'taxCertificate':
                updateData['kycDocuments.taxCertificateUri'] = uploadResult.uri;
                updateData['kycDocuments.taxCertificateHash'] = uploadResult.hash;
                break;
            case 'bankStatement':
                updateData['kycDocuments.bankStatementUri'] = uploadResult.uri;
                updateData['kycDocuments.bankStatementHash'] = uploadResult.hash;
                break;
        }
        const vendor = await this.vendorModel.findOneAndUpdate({ userId }, { $set: updateData }, { new: true, runValidators: true }).populate('userId', 'email profile').exec();
        if (!vendor) {
            throw new common_1.NotFoundException('Vendor not found');
        }
        return vendor;
    }
    async updateVendorKycDocumentType(userId, documentType) {
        const vendor = await this.vendorModel.findOneAndUpdate({ userId }, { $set: { 'kycDocuments.identityDocumentType': documentType } }, { new: true, runValidators: true }).populate('userId', 'email profile').exec();
        if (!vendor) {
            throw new common_1.NotFoundException('Vendor not found');
        }
        return vendor;
    }
    async updateVendorKycVerificationStatus(userId, status, notes, verifiedBy) {
        const updateData = {
            'kycDocuments.verificationStatus': status,
            'kycDocuments.verificationNotes': notes,
        };
        if (status === 'approved' || status === 'rejected') {
            updateData['kycDocuments.verifiedAt'] = new Date();
            updateData['kycDocuments.verifiedBy'] = verifiedBy;
        }
        if (status === 'approved') {
            updateData['verified'] = true;
        }
        const vendor = await this.vendorModel.findOneAndUpdate({ userId }, { $set: updateData }, { new: true, runValidators: true }).populate('userId', 'email profile').exec();
        if (!vendor) {
            throw new common_1.NotFoundException('Vendor not found');
        }
        return vendor;
    }
    async getVendorKycStatus(userId) {
        const vendor = await this.vendorModel.findOne({ userId }).select('kycDocuments').exec();
        if (!vendor) {
            throw new common_1.NotFoundException('Vendor not found');
        }
        return vendor.kycDocuments || null;
    }
    async getPendingKycVerifications() {
        return this.vendorModel
            .find({ 'kycDocuments.verificationStatus': 'pending' })
            .populate('userId', 'email profile')
            .exec();
    }
    async getVendorsByVerificationStatus(status) {
        return this.vendorModel
            .find({ 'kycDocuments.verificationStatus': status })
            .populate('userId', 'email profile')
            .exec();
    }
    async uploadLogo(userId, file) {
        const vendor = await this.findByUserId(userId);
        const { uri, hash } = await this.minioService.uploadFile(file, 'vendors');
        vendor.storeSettings.logo = uri;
        vendor.storeSettings.logoUri = uri;
        vendor.storeSettings.logoHash = hash;
        await vendor.save();
        return vendor;
    }
    async uploadKycDocument(userId, file, type) {
        const vendor = await this.findByUserId(userId);
        const { uri, hash } = await this.minioService.uploadFile(file, 'vendors');
        if (!vendor.kycDocuments)
            vendor.kycDocuments = {};
        if (type === 'identity') {
            vendor.kycDocuments.identityDocumentUri = uri;
            vendor.kycDocuments.identityDocumentHash = hash;
        }
        else if (type === 'businessCertificate') {
            vendor.kycDocuments.businessCertificateUri = uri;
            vendor.kycDocuments.businessCertificateHash = hash;
        }
        await vendor.save();
        return vendor;
    }
};
exports.VendorsService = VendorsService;
exports.VendorsService = VendorsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(vendor_schema_1.Vendor.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        minio_service_1.MinioService])
], VendorsService);
//# sourceMappingURL=vendors.service.js.map