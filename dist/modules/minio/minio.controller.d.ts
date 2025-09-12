import { MinioService } from './minio.service';
export declare class MinioController {
    private readonly minioService;
    constructor(minioService: MinioService);
    upload(file: Express.Multer.File, prefix?: string): Promise<import("./minio.service").MinioUploadResult>;
}
