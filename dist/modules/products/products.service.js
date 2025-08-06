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
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const product_schema_1 = require("./schemas/product.schema");
const vendors_service_1 = require("../vendors/vendors.service");
let ProductsService = class ProductsService {
    constructor(productModel, vendorsService) {
        this.productModel = productModel;
        this.vendorsService = vendorsService;
    }
    async create(userId, createProductDto) {
        const vendor = await this.vendorsService.findByUserId(userId);
        const createdProduct = new this.productModel({
            vendorId: vendor._id,
            ...createProductDto,
        });
        return createdProduct.save();
    }
    async findAll(query = {}) {
        const filter = { isActive: true, ...query };
        return this.productModel
            .find(filter)
            .populate('vendorId', 'businessName storeSettings')
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
    async findByVendor(vendorId) {
        return this.productModel
            .find({ vendorId, isActive: true })
            .populate('vendorId', 'businessName')
            .exec();
    }
    async findByCurrentVendor(userId) {
        const vendor = await this.vendorsService.findByUserId(userId);
        return this.productModel.find({ vendorId: vendor._id }).exec();
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
    async search(searchTerm) {
        return this.productModel
            .find({
            isActive: true,
            $or: [
                { name: { $regex: searchTerm, $options: 'i' } },
                { description: { $regex: searchTerm, $options: 'i' } },
                { tags: { $in: [new RegExp(searchTerm, 'i')] } },
            ],
        })
            .populate('vendorId', 'businessName storeSettings')
            .exec();
    }
    async getCategories() {
        return this.productModel.distinct('category', { isActive: true }).exec();
    }
    async updateInventory(productId, quantity) {
        await this.productModel.findByIdAndUpdate(productId, { $inc: { 'inventory.stock': -quantity } }).exec();
    }
    async uploadImages(productId, userId, files) {
        const imageUrls = files.map(f => `uploads/products/${f.filename || f.originalname}`);
        const product = await this.findOne(productId);
        const vendor = await this.vendorsService.findByUserId(userId);
        if (product.vendorId.toString() !== vendor._id.toString()) {
            throw new common_1.ForbiddenException('You can only update your own products');
        }
        product.images = [...(product.images || []), ...imageUrls];
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
    async getFeatured() {
        return this.productModel.find({ featured: true, isActive: true }).exec();
    }
    async getTrending() {
        return this.productModel.find({ isActive: true }).sort({ sales: -1 }).limit(10).exec();
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(product_schema_1.Product.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        vendors_service_1.VendorsService])
], ProductsService);
//# sourceMappingURL=products.service.js.map