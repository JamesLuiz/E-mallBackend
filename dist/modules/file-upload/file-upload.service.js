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
const minio_service_1 = require("../minio/minio.service");
let FileUploadService = class FileUploadService {
    constructor(minioService) {
        this.minioService = minioService;
    }
    async uploadFile(file) {
        try {
            if (!file) {
                throw new common_1.BadRequestException('No file provided');
            }
            return await this.minioService.uploadFile(file);
        }
        catch (error) {
            console.error('File upload error:', error);
            throw new common_1.BadRequestException(`File upload failed: ${error.message}`);
        }
    }
    async uploadMultipleFiles(files) {
        if (!files || files.length === 0) {
            throw new common_1.BadRequestException('No files provided');
        }
        return await Promise.all(files.map((file) => this.minioService.uploadFile(file)));
    }
    async deleteFile(hash) {
        try {
            return true;
        }
        catch (error) {
            console.error('File deletion error:', error);
            return false;
        }
    }
    async getFileInfo(hash) {
        try {
            return null;
        }
        catch (error) {
            console.error('Get file info error:', error);
            return null;
        }
    }
    async uploadProfilePicture(file, userId) {
        return this.minioService.uploadFile(file, 'users');
    }
    async uploadProductImages(files, productId, vendorId) {
        return Promise.all(files.map((f) => this.minioService.uploadFile(f, 'products')));
    }
    async uploadKycDocuments(files, userId, documentType) {
        return Promise.all(files.map((f) => this.minioService.uploadFile(f, 'kyc')));
    }
    async uploadVendorLogo(file, vendorId) {
        return this.minioService.uploadFile(file, 'vendors');
    }
    async uploadVendorBanner(file, vendorId) {
        return this.minioService.uploadFile(file, 'vendors');
    }
};
exports.FileUploadService = FileUploadService;
exports.FileUploadService = FileUploadService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [minio_service_1.MinioService])
], FileUploadService);
//# sourceMappingURL=file-upload.service.js.map