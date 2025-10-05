import { FileUploadService } from './file-upload.service';
export declare class FileUploadController {
    private readonly fileUploadService;
    constructor(fileUploadService: FileUploadService);
    uploadSingle(file: Express.Multer.File): Promise<{
        uri: string;
        hash: string;
        originalName?: string;
        message: string;
    }>;
    uploadMultiple(files: Express.Multer.File[]): Promise<{
        message: string;
        files: import("../minio/minio.service").MinioUploadResult[];
    }>;
    uploadProfilePicture(file: Express.Multer.File, userId: string): Promise<{
        uri: string;
        hash: string;
        originalName?: string;
        message: string;
    }>;
    uploadKycDocuments(files: Express.Multer.File[], documentType: string, userId: string): Promise<{
        message: string;
        documents: import("../minio/minio.service").MinioUploadResult[];
    }>;
    uploadProductImages(files: Express.Multer.File[], productId: string, userId: string): Promise<{
        message: string;
        images: import("../minio/minio.service").MinioUploadResult[];
    }>;
    uploadVendorLogo(file: Express.Multer.File, userId: string): Promise<{
        uri: string;
        hash: string;
        originalName?: string;
        message: string;
    }>;
    uploadVendorBanner(file: Express.Multer.File, userId: string): Promise<{
        uri: string;
        hash: string;
        originalName?: string;
        message: string;
    }>;
}
