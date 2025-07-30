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
const nft_storage_1 = require("nft.storage");
const uuid_1 = require("uuid");
let FileUploadService = class FileUploadService {
    constructor() {
        const apiKey = process.env.NFTUP_API_KEY;
        if (!apiKey) {
            throw new Error('NFTUP_API_KEY environment variable is required');
        }
        this.nftStorage = new nft_storage_1.NFTStorage({ token: apiKey });
    }
    async uploadFile(file) {
        try {
            if (!file) {
                throw new common_1.BadRequestException('No file provided');
            }
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
            if (!allowedTypes.includes(file.mimetype)) {
                throw new common_1.BadRequestException('Invalid file type. Only images are allowed.');
            }
            const maxSize = 5 * 1024 * 1024;
            if (file.size > maxSize) {
                throw new common_1.BadRequestException('File size too large. Maximum 5MB allowed.');
            }
            const fileObj = new File([file.buffer], `${(0, uuid_1.v4)()}-${file.originalname}`, {
                type: file.mimetype,
            });
            const cid = await this.nftStorage.storeBlob(fileObj);
            return `https://nftstorage.link/ipfs/${cid}`;
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
        const uploadPromises = files.map(file => this.uploadFile(file));
        return Promise.all(uploadPromises);
    }
    async deleteFile(cid) {
        try {
            console.log(`File deletion requested for CID: ${cid}`);
            return true;
        }
        catch (error) {
            console.error('File deletion error:', error);
            return false;
        }
    }
};
exports.FileUploadService = FileUploadService;
exports.FileUploadService = FileUploadService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], FileUploadService);
//# sourceMappingURL=file-upload.service.js.map