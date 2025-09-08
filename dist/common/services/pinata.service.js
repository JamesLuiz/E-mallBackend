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
exports.PinataService = exports.FileType = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const pinata_1 = require("pinata");
var FileType;
(function (FileType) {
    FileType["PROFILE_PICTURE"] = "profile-pictures";
    FileType["PRODUCT_IMAGE"] = "product-images";
    FileType["KYC_DOCUMENT"] = "kyc-documents";
    FileType["VENDOR_LOGO"] = "vendor-logos";
    FileType["VENDOR_BANNER"] = "vendor-banners";
    FileType["GENERAL"] = "general";
})(FileType || (exports.FileType = FileType = {}));
let PinataService = class PinataService {
    constructor(configService) {
        this.configService = configService;
        const jwt = this.configService.get('PINATA_JWT');
        const gateway = this.configService.get('PINATA_GATEWAY');
        if (!jwt) {
            throw new Error('PINATA_JWT environment variable is required');
        }
        this.pinata = new pinata_1.PinataSDK({
            pinataJwt: jwt,
            pinataGateway: gateway,
        });
    }
    async uploadFile(file, fileType = FileType.GENERAL, metadata) {
        try {
            if (!file) {
                throw new common_1.BadRequestException('No file provided');
            }
            this.validateFile(file, fileType);
            const fileObj = new File([file.buffer], file.originalname, {
                type: file.mimetype,
            });
            const upload = await this.pinata.upload.private.file(fileObj)
                .name(file.originalname)
                .keyvalues({
                fileType,
                uploadedAt: new Date().toISOString(),
                originalSize: file.size.toString(),
                mimeType: file.mimetype,
                ...metadata,
            });
            const signedUrl = await this.pinata.gateways.private.createAccessLink({
                cid: upload.cid,
                expires: 31536000,
            });
            return {
                uri: signedUrl,
                hash: upload.cid,
                size: file.size,
                originalName: file.originalname,
            };
        }
        catch (error) {
            console.error('Pinata upload error:', error);
            throw new common_1.BadRequestException(`File upload failed: ${error.message}`);
        }
    }
    async uploadMultipleFiles(files, fileType = FileType.GENERAL, metadata) {
        if (!files || files.length === 0) {
            throw new common_1.BadRequestException('No files provided');
        }
        const uploadPromises = files.map(file => this.uploadFile(file, fileType, metadata));
        return Promise.all(uploadPromises);
    }
    validateFile(file, fileType) {
        const validationRules = this.getValidationRules(fileType);
        if (!validationRules.allowedTypes.includes(file.mimetype)) {
            throw new common_1.BadRequestException(`Invalid file type. Allowed types: ${validationRules.allowedTypes.join(', ')}`);
        }
        if (file.size > validationRules.maxSize) {
            throw new common_1.BadRequestException(`File size too large. Maximum ${validationRules.maxSize / (1024 * 1024)}MB allowed.`);
        }
    }
    getValidationRules(fileType) {
        const rules = {
            [FileType.PROFILE_PICTURE]: {
                allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
                maxSize: 5 * 1024 * 1024,
            },
            [FileType.PRODUCT_IMAGE]: {
                allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
                maxSize: 10 * 1024 * 1024,
            },
            [FileType.KYC_DOCUMENT]: {
                allowedTypes: [
                    'image/jpeg', 'image/jpg', 'image/png', 'image/webp',
                    'application/pdf', 'application/msword',
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                ],
                maxSize: 15 * 1024 * 1024,
            },
            [FileType.VENDOR_LOGO]: {
                allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/svg+xml'],
                maxSize: 2 * 1024 * 1024,
            },
            [FileType.VENDOR_BANNER]: {
                allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
                maxSize: 8 * 1024 * 1024,
            },
            [FileType.GENERAL]: {
                allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
                maxSize: 5 * 1024 * 1024,
            },
        };
        return rules[fileType] || rules[FileType.GENERAL];
    }
    async deleteFile(cid) {
        try {
            const files = await this.pinata.files.private.list()
                .cid(cid);
            if (files.files && files.files.length > 0) {
                const fileId = files.files[0].id;
                await this.pinata.files.private.delete([fileId]);
                return true;
            }
            return false;
        }
        catch (error) {
            console.error('Pinata delete error:', error);
            return false;
        }
    }
    async getFileInfo(cid) {
        try {
            const files = await this.pinata.files.private.list()
                .cid(cid);
            return files.files && files.files.length > 0 ? files.files[0] : null;
        }
        catch (error) {
            console.error('Pinata get file info error:', error);
            return null;
        }
    }
};
exports.PinataService = PinataService;
exports.PinataService = PinataService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], PinataService);
//# sourceMappingURL=pinata.service.js.map