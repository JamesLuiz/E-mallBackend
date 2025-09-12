import { MinioService } from '../modules/minio/minio.service';
export declare class UploadsService {
    private readonly minioService;
    constructor(minioService: MinioService);
    uploadImage(file: Express.Multer.File, folder?: string): Promise<{
        uri: string;
        hash: string;
    }>;
    uploadMultipleImages(files: Express.Multer.File[], folder?: string): Promise<{
        uri: string;
        hash: string;
    }[]>;
    deleteImage(publicId: string): Promise<void>;
}
