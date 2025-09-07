import { ConfigService } from '@nestjs/config';
export interface FileUploadResult {
    uri: string;
    hash: string;
    size: number;
    originalName: string;
}
export declare enum FileType {
    PROFILE_PICTURE = "profile-pictures",
    PRODUCT_IMAGE = "product-images",
    KYC_DOCUMENT = "kyc-documents",
    VENDOR_LOGO = "vendor-logos",
    VENDOR_BANNER = "vendor-banners",
    GENERAL = "general"
}
export declare class PinataService {
    private configService;
    private pinata;
    constructor(configService: ConfigService);
    uploadFile(file: Express.Multer.File, fileType?: FileType, metadata?: Record<string, any>): Promise<FileUploadResult>;
    uploadMultipleFiles(files: Express.Multer.File[], fileType?: FileType, metadata?: Record<string, any>): Promise<FileUploadResult[]>;
    private validateFile;
    private getValidationRules;
    deleteFile(cid: string): Promise<boolean>;
    getFileInfo(cid: string): Promise<any>;
}
