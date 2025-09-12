import { MinioService, MinioUploadResult } from '../minio/minio.service';
export declare class FileUploadService {
    private readonly minioService;
    constructor(minioService: MinioService);
    uploadFile(file: Express.Multer.File): Promise<MinioUploadResult>;
    uploadMultipleFiles(files: Express.Multer.File[]): Promise<MinioUploadResult[]>;
    deleteFile(hash: string): Promise<boolean>;
    getFileInfo(hash: string): Promise<any>;
    uploadProfilePicture(file: Express.Multer.File, userId: string): Promise<MinioUploadResult>;
    uploadProductImages(files: Express.Multer.File[], productId: string, vendorId: string): Promise<MinioUploadResult[]>;
    uploadKycDocuments(files: Express.Multer.File[], userId: string, documentType: string): Promise<MinioUploadResult[]>;
    uploadVendorLogo(file: Express.Multer.File, vendorId: string): Promise<MinioUploadResult>;
    uploadVendorBanner(file: Express.Multer.File, vendorId: string): Promise<MinioUploadResult>;
}
