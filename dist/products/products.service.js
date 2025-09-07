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
const pinata_service_1 = require("../uploads/pinata.service");
let ProductsService = class ProductsService {
    constructor(productModel, vendorsService, pinataService) {
        this.productModel = productModel;
        this.vendorsService = vendorsService;
        this.pinataService = pinataService;
    }
    async uploadImages(productId, userId, files) {
        const product = await this.findOne(productId);
        const vendor = await this.vendorsService.findByUserId(userId);
        if (product.vendorId.toString() !== vendor._id.toString()) {
            throw new common_1.ForbiddenException('You can only update your own products');
        }
        const imageResults = await Promise.all(files.map(file => this.pinataService.uploadFile(file)));
        const imageUris = imageResults.map(r => r.uri);
        product.images = [...(product.images || []), ...imageUris];
        await product.save();
        return product;
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(product_schema_1.Product.name)),
    __metadata("design:paramtypes", [mongoose_2.Model, typeof (_a = typeof vendors_service_1.VendorsService !== "undefined" && vendors_service_1.VendorsService) === "function" ? _a : Object, pinata_service_1.PinataService])
], ProductsService);
//# sourceMappingURL=products.service.js.map