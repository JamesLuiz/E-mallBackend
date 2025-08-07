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
exports.FileUploadService = void 0;
const common_1 = require("@nestjs/common");
const pinata_service_1 = require("../../common/services/pinata.service");
let FileUploadService = class FileUploadService {
    constructor(pinataService) {
        this.pinataService = pinataService;
    }
    async uploadFile(file, fileType = pinata_service_1.FileType.GENERAL, metadata) {
        try {
            if (!file) {
                throw new common_1.BadRequestException('No file provided');
            }
            return await this.pinataService.uploadFile(file, fileType, metadata);
        }
        catch (error) {
            console.error('File upload error:', error);
            throw new common_1.BadRequestException(`File upload failed: ${error.message}`);
        }
    }
    async uploadMultipleFiles(files, fileType = pinata_service_1.FileType.GENERAL, metadata) {
        if (!files || files.length === 0) {
            throw new common_1.BadRequestException('No files provided');
        }
        return await this.pinataService.uploadMultipleFiles(files, fileType, metadata);
    }
    async deleteFile(hash) {
        try {
            return await this.pinataService.deleteFile(hash);
        }
        catch (error) {
            console.error('File deletion error:', error);
            return false;
        }
    }
    async getFileInfo(hash) {
        try {
            return await this.pinataService.getFileInfo(hash);
        }
        catch (error) {
            console.error('Get file info error:', error);
            return null;
        }
    }
    async uploadProfilePicture(file, userId) {
        return this.uploadFile(file, pinata_service_1.FileType.PROFILE_PICTURE, { userId });
    }
    async uploadProductImages(files, productId, vendorId) {
        return this.uploadMultipleFiles(files, pinata_service_1.FileType.PRODUCT_IMAGE, { productId, vendorId });
    }
    async uploadKycDocuments(files, userId, documentType) {
        return this.uploadMultipleFiles(files, pinata_service_1.FileType.KYC_DOCUMENT, { userId, documentType });
    }
    async uploadVendorLogo(file, vendorId) {
        return this.uploadFile(file, pinata_service_1.FileType.VENDOR_LOGO, { vendorId });
    }
    async uploadVendorBanner(file, vendorId) {
        return this.uploadFile(file, pinata_service_1.FileType.VENDOR_BANNER, { vendorId });
    }
};
exports.FileUploadService = FileUploadService;
exports.FileUploadService = FileUploadService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [pinata_service_1.PinataService])
], FileUploadService);
//# sourceMappingURL=file-upload.service.js.map