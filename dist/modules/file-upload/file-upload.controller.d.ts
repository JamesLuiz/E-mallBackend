import { FileUploadService } from './file-upload.service';
export declare class FileUploadController {
    private readonly fileUploadService;
    constructor(fileUploadService: FileUploadService);
    uploadSingle(file: Express.Multer.File): Promise<{
        uri: string;
        hash: string;
        size: number;
        originalName: string;
        message: string;
    }>;
    uploadMultiple(files: Express.Multer.File[]): Promise<{
        message: string;
        files: import("../../common/services/pinata.service").FileUploadResult[];
    }>;
    uploadProfilePicture(file: Express.Multer.File, userId: string): Promise<{
        uri: string;
        hash: string;
        size: number;
        originalName: string;
        message: string;
    }>;
    uploadKycDocuments(files: Express.Multer.File[], documentType: string, userId: string): Promise<{
        message: string;
        documents: import("../../common/services/pinata.service").FileUploadResult[];
    }>;
    uploadProductImages(files: Express.Multer.File[], productId: string, userId: string): Promise<{
        message: string;
        images: import("../../common/services/pinata.service").FileUploadResult[];
    }>;
    uploadVendorLogo(file: Express.Multer.File, userId: string): Promise<{
        uri: string;
        hash: string;
        size: number;
        originalName: string;
        message: string;
    }>;
    uploadVendorBanner(file: Express.Multer.File, userId: string): Promise<{
        uri: string;
        hash: string;
        size: number;
        originalName: string;
        message: string;
    }>;
}
