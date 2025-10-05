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
exports.MinioService = void 0;
const common_1 = require("@nestjs/common");
const minio_1 = require("minio");
let MinioService = class MinioService {
    constructor() {
        this.bucket = process.env.MINIO_BUCKET || 'uploads';
        this.publicBaseUrl = process.env.MINIO_PUBLIC_BASE_URL || '';
        this.client = new minio_1.Client({
            endPoint: process.env.MINIO_ENDPOINT || '127.0.0.1',
            port: process.env.MINIO_PORT ? parseInt(process.env.MINIO_PORT, 10) : 9000,
            useSSL: (process.env.MINIO_USE_SSL || 'false') === 'true',
            accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
            secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin',
        });
    }
    async ensureBucket() {
        const exists = await this.client.bucketExists(this.bucket).catch(() => false);
        if (!exists) {
            await this.client.makeBucket(this.bucket, '').catch(() => {
                throw new common_1.InternalServerErrorException('Failed to create MinIO bucket');
            });
        }
    }
    async uploadFile(file, prefix = 'general') {
        await this.ensureBucket();
        const objectName = `${prefix}/${Date.now()}-${file.originalname}`;
        try {
            await this.client.putObject(this.bucket, objectName, file.buffer, file.size, {
                'Content-Type': file.mimetype,
            });
            const uri = this.publicBaseUrl
                ? `${this.publicBaseUrl}/${this.bucket}/${objectName}`
                : `${this.client.protocol}//${this.client.host}/${this.bucket}/${objectName}`;
            return { uri, hash: objectName, originalName: file.originalname };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Failed to upload file to MinIO');
        }
    }
};
exports.MinioService = MinioService;
exports.MinioService = MinioService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], MinioService);
//# sourceMappingURL=minio.service.js.map