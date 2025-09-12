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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const product_schema_1 = require("./schemas/product.schema");
const vendors_service_1 = require("../vendors/vendors.service");
const minio_service_1 = require("../modules/minio/minio.service");
let ProductsService = class ProductsService {
    constructor(productModel, vendorsService, minioService) {
        this.productModel = productModel;
        this.vendorsService = vendorsService;
        this.minioService = minioService;
    }
    async create(userId, createProductDto) {
        const vendor = await this.vendorsService.findByUserId(userId);
        const createdProduct = new this.productModel({
            vendorId: vendor._id,
            ...createProductDto,
        });
        return createdProduct.save();
    }
    async findAll(filter = {}) {
        const query = { isActive: true };
        if (filter.category)
            query.category = filter.category;
        if (filter.vendor)
            query.vendorId = filter.vendor;
        if (filter.search) {
            query.$or = [
                { name: { $regex: filter.search, $options: 'i' } },
                { description: { $regex: filter.search, $options: 'i' } },
                { tags: { $in: [new RegExp(filter.search, 'i')] } },
            ];
        }
        if (filter.minPrice)
            query.price = { $gte: filter.minPrice };
        if (filter.maxPrice) {
            query.price = { ...query.price, $lte: filter.maxPrice };
        }
        if (filter.status)
            query.status = filter.status;
        const page = filter.page || 1;
        const limit = filter.limit || 20;
        return this.productModel
            .find(query)
            .skip((page - 1) * limit)
            .limit(limit)
            .populate('vendorId', 'businessName storeSettings')
            .sort({ createdAt: -1 })
            .exec();
    }
    async findOne(id) {
        const product = await this.productModel
            .findOne({ _id: id, isActive: true })
            .populate('vendorId', 'businessName storeSettings rating')
            .exec();
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        return product;
    }
    async findByVendor(vendorId, filter = {}) {
        const query = { vendorId, isActive: true };
        if (filter.category)
            query.category = filter.category;
        if (filter.search) {
            query.$or = [
                { name: { $regex: filter.search, $options: 'i' } },
                { description: { $regex: filter.search, $options: 'i' } },
            ];
        }
        if (filter.status)
            query.status = filter.status;
        const page = filter.page || 1;
        const limit = filter.limit || 20;
        return this.productModel
            .find(query)
            .skip((page - 1) * limit)
            .limit(limit)
            .populate('vendorId', 'businessName')
            .sort({ createdAt: -1 })
            .exec();
    }
    async findByCurrentVendor(userId, filter = {}) {
        const vendor = await this.vendorsService.findByUserId(userId);
        return this.findByVendor(vendor._id.toString(), filter);
    }
    async update(id, userId, updateProductDto) {
        const product = await this.findOne(id);
        const vendor = await this.vendorsService.findByUserId(userId);
        if (product.vendorId.toString() !== vendor._id.toString()) {
            throw new common_1.ForbiddenException('You can only update your own products');
        }
        const updatedProduct = await this.productModel
            .findByIdAndUpdate(id, updateProductDto, { new: true, runValidators: true })
            .populate('vendorId', 'businessName storeSettings')
            .exec();
        return updatedProduct;
    }
    async remove(id, userId) {
        const product = await this.findOne(id);
        const vendor = await this.vendorsService.findByUserId(userId);
        if (product.vendorId.toString() !== vendor._id.toString()) {
            throw new common_1.ForbiddenException('You can only delete your own products');
        }
        await this.productModel.findByIdAndUpdate(id, { isActive: false }).exec();
    }
    async search(searchTerm, filter = {}) {
        const query = {
            isActive: true,
            $or: [
                { name: { $regex: searchTerm, $options: 'i' } },
                { description: { $regex: searchTerm, $options: 'i' } },
                { tags: { $in: [new RegExp(searchTerm, 'i')] } },
            ],
        };
        if (filter.category)
            query.category = filter.category;
        if (filter.minPrice)
            query.price = { $gte: filter.minPrice };
        if (filter.maxPrice) {
            query.price = { ...query.price, $lte: filter.maxPrice };
        }
        const page = filter.page || 1;
        const limit = filter.limit || 20;
        return this.productModel
            .find(query)
            .skip((page - 1) * limit)
            .limit(limit)
            .populate('vendorId', 'businessName storeSettings')
            .sort({ createdAt: -1 })
            .exec();
    }
    async getCategories() {
        return this.productModel.distinct('category', { isActive: true }).exec();
    }
    async updateInventory(productId, quantity) {
        await this.productModel.findByIdAndUpdate(productId, { $inc: { 'inventory.stock': -quantity } }).exec();
    }
    async uploadImages(productId, userId, files) {
        const product = await this.findOne(productId);
        const vendor = await this.vendorsService.findByUserId(userId);
        if (product.vendorId.toString() !== vendor._id.toString()) {
            throw new common_1.ForbiddenException('You can only update your own products');
        }
        const imageResults = await Promise.all(files.map(file => this.minioService.uploadFile(file, 'products')));
        const imageUris = imageResults.map((r) => r.uri);
        product.images = [...(product.images || []), ...imageUris];
        await product.save();
        return product;
    }
    async addProductImages(productId, userId, uploadResults) {
        const product = await this.findOne(productId);
        const vendor = await this.vendorsService.findByUserId(userId);
        if (product.vendorId.toString() !== vendor._id.toString()) {
            throw new common_1.ForbiddenException('You can only update your own products');
        }
        const productImages = uploadResults.map(result => ({
            uri: result.uri,
            hash: result.hash,
            originalName: result.originalName,
            isPrimary: false,
            uploadedAt: new Date(),
        }));
        if (!product.imageUris || product.imageUris.length === 0) {
            productImages[0].isPrimary = true;
        }
        const updatedProduct = await this.productModel
            .findByIdAndUpdate(productId, {
            $push: { imageUris: { $each: productImages } },
            $addToSet: { images: { $each: uploadResults.map(r => r.uri) } },
        }, { new: true, runValidators: true })
            .populate('vendorId', 'businessName storeSettings')
            .exec();
        return updatedProduct;
    }
    async setPrimaryImage(productId, userId, imageHash) {
        const product = await this.findOne(productId);
        const vendor = await this.vendorsService.findByUserId(userId);
        if (product.vendorId.toString() !== vendor._id.toString()) {
            throw new common_1.ForbiddenException('You can only update your own products');
        }
        await this.productModel.updateOne({ _id: productId }, { $set: { 'imageUris.$[].isPrimary': false } });
        const updatedProduct = await this.productModel
            .findOneAndUpdate({ _id: productId, 'imageUris.hash': imageHash }, { $set: { 'imageUris.$.isPrimary': true } }, { new: true, runValidators: true })
            .populate('vendorId', 'businessName storeSettings')
            .exec();
        return updatedProduct;
    }
    async removeProductImage(productId, userId, imageHash) {
        const product = await this.findOne(productId);
        const vendor = await this.vendorsService.findByUserId(userId);
        if (product.vendorId.toString() !== vendor._id.toString()) {
            throw new common_1.ForbiddenException('You can only update your own products');
        }
        const updatedProduct = await this.productModel
            .findByIdAndUpdate(productId, {
            $pull: {
                imageUris: { hash: imageHash },
                images: { $in: [product.imageUris?.find(img => img.hash === imageHash)?.uri] }
            }
        }, { new: true, runValidators: true })
            .populate('vendorId', 'businessName storeSettings')
            .exec();
        return updatedProduct;
    }
    async getProductImages(productId) {
        const product = await this.productModel.findById(productId).select('imageUris').exec();
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        return product.imageUris || [];
    }
    async getFeatured(limit = 10) {
        return this.productModel
            .find({ featured: true, isActive: true })
            .limit(limit)
            .populate('vendorId', 'businessName storeSettings')
            .sort({ createdAt: -1 })
            .exec();
    }
    async getTrending(limit = 10) {
        return this.productModel
            .find({ isActive: true })
            .sort({ sales: -1, views: -1 })
            .limit(limit)
            .populate('vendorId', 'businessName storeSettings')
            .exec();
    }
    async getNewArrivals(limit = 10) {
        return this.productModel
            .find({ isActive: true })
            .sort({ createdAt: -1 })
            .limit(limit)
            .populate('vendorId', 'businessName storeSettings')
            .exec();
    }
    async getTopRated(limit = 10) {
        return this.productModel
            .find({ isActive: true, rating: { $gte: 4 } })
            .sort({ rating: -1, reviewCount: -1 })
            .limit(limit)
            .populate('vendorId', 'businessName storeSettings')
            .exec();
    }
    async getOnSale(limit = 20) {
        return this.productModel
            .find({
            isActive: true,
            discount: { $gt: 0 }
        })
            .sort({ discount: -1 })
            .limit(limit)
            .populate('vendorId', 'businessName storeSettings')
            .exec();
    }
    async getByCategory(category, filter = {}) {
        const query = { category, isActive: true };
        if (filter.minPrice)
            query.price = { $gte: filter.minPrice };
        if (filter.maxPrice) {
            query.price = { ...query.price, $lte: filter.maxPrice };
        }
        if (filter.search) {
            query.$or = [
                { name: { $regex: filter.search, $options: 'i' } },
                { description: { $regex: filter.search, $options: 'i' } },
            ];
        }
        const page = filter.page || 1;
        const limit = filter.limit || 20;
        return this.productModel
            .find(query)
            .skip((page - 1) * limit)
            .limit(limit)
            .populate('vendorId', 'businessName storeSettings')
            .sort({ createdAt: -1 })
            .exec();
    }
    async incrementViews(productId) {
        await this.productModel.findByIdAndUpdate(productId, { $inc: { views: 1 } }).exec();
    }
    async updateRating(productId, newRating, reviewCount) {
        const updatedProduct = await this.productModel
            .findByIdAndUpdate(productId, {
            rating: newRating,
            reviewCount: reviewCount
        }, { new: true })
            .populate('vendorId', 'businessName storeSettings')
            .exec();
        if (!updatedProduct) {
            throw new common_1.NotFoundException('Product not found');
        }
        return updatedProduct;
    }
    async getRelatedProducts(productId, limit = 5) {
        const product = await this.findOne(productId);
        return this.productModel
            .find({
            _id: { $ne: productId },
            category: product.category,
            isActive: true
        })
            .limit(limit)
            .populate('vendorId', 'businessName storeSettings')
            .sort({ rating: -1 })
            .exec();
    }
    async getProductStats(productId) {
        const product = await this.findOne(productId);
        return {
            views: product.views || 0,
            sales: product.sales || 0,
            rating: product.rating || 0,
            reviewCount: product.reviewCount || 0,
            stockLevel: product.inventory.stock,
            isLowStock: product.inventory.stock <= (product.inventory.lowStockAlert || 10),
        };
    }
    async toggleFeatured(productId, userId) {
        const product = await this.findOne(productId);
        const vendor = await this.vendorsService.findByUserId(userId);
        if (product.vendorId.toString() !== vendor._id.toString()) {
            throw new common_1.ForbiddenException('You can only update your own products');
        }
        const updatedProduct = await this.productModel
            .findByIdAndUpdate(productId, { featured: !product.featured }, { new: true })
            .populate('vendorId', 'businessName storeSettings')
            .exec();
        return updatedProduct;
    }
    async bulkUpdateStatus(productIds, status, userId) {
        const vendor = await this.vendorsService.findByUserId(userId);
        const result = await this.productModel.updateMany({
            _id: { $in: productIds },
            vendorId: vendor._id
        }, { status }).exec();
        return { updated: result.modifiedCount };
    }
    async getVendorProductStats(userId) {
        const vendor = await this.vendorsService.findByUserId(userId);
        const stats = await this.productModel.aggregate([
            { $match: { vendorId: vendor._id } },
            {
                $group: {
                    _id: null,
                    totalProducts: { $sum: 1 },
                    activeProducts: { $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] } },
                    totalViews: { $sum: '$views' },
                    totalSales: { $sum: '$sales' },
                    averageRating: { $avg: '$rating' },
                    totalStock: { $sum: '$inventory.stock' },
                    lowStockProducts: {
                        $sum: {
                            $cond: [
                                { $lte: ['$inventory.stock', '$inventory.lowStockAlert'] },
                                1,
                                0
                            ]
                        }
                    }
                }
            }
        ]);
        return stats[0] || {
            totalProducts: 0,
            activeProducts: 0,
            totalViews: 0,
            totalSales: 0,
            averageRating: 0,
            totalStock: 0,
            lowStockProducts: 0,
        };
    }
    async getLowStockProducts(userId) {
        const vendor = await this.vendorsService.findByUserId(userId);
        return this.productModel
            .find({
            vendorId: vendor._id,
            isActive: true,
            $expr: { $lte: ['$inventory.stock', '$inventory.lowStockAlert'] }
        })
            .populate('vendorId', 'businessName')
            .sort({ 'inventory.stock': 1 })
            .exec();
    }
    async duplicateProduct(productId, userId) {
        const originalProduct = await this.findOne(productId);
        const vendor = await this.vendorsService.findByUserId(userId);
        if (originalProduct.vendorId.toString() !== vendor._id.toString()) {
            throw new common_1.ForbiddenException('You can only duplicate your own products');
        }
        const productData = originalProduct.toObject();
        delete productData._id;
        delete productData.createdAt;
        delete productData.updatedAt;
        productData.name = `${productData.name} (Copy)`;
        productData.isActive = false;
        const duplicatedProduct = new this.productModel(productData);
        return duplicatedProduct.save();
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(product_schema_1.Product.name)),
    __metadata("design:paramtypes", [mongoose_2.Model, typeof (_a = typeof vendors_service_1.VendorsService !== "undefined" && vendors_service_1.VendorsService) === "function" ? _a : Object, minio_service_1.MinioService])
], ProductsService);
//# sourceMappingURL=products.service.js.map