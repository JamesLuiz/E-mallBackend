import { PinataService, FileType, FileUploadResult } from '../../common/services/pinata.service';
export declare class FileUploadService {
    private readonly pinataService;
    constructor(pinataService: PinataService);
    uploadFile(file: Express.Multer.File, fileType?: FileType, metadata?: Record<string, any>): Promise<FileUploadResult>;
    uploadMultipleFiles(files: Express.Multer.File[], fileType?: FileType, metadata?: Record<string, any>): Promise<FileUploadResult[]>;
    deleteFile(hash: string): Promise<boolean>;
<<<<<<< HEAD
    getFileInfo(hash: string): Promise<any>;
=======
    getFileInfo(hash: string): Promise<import("pinata").FileListItem>;
>>>>>>> 78160f189fb790d419dad7b1657b0833b54abdcb
    uploadProfilePicture(file: Express.Multer.File, userId: string): Promise<FileUploadResult>;
    uploadProductImages(files: Express.Multer.File[], productId: string, vendorId: string): Promise<FileUploadResult[]>;
    uploadKycDocuments(files: Express.Multer.File[], userId: string, documentType: string): Promise<FileUploadResult[]>;
    uploadVendorLogo(file: Express.Multer.File, vendorId: string): Promise<FileUploadResult>;
    uploadVendorBanner(file: Express.Multer.File, vendorId: string): Promise<FileUploadResult>;
}
