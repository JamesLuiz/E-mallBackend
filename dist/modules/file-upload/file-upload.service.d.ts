export declare class FileUploadService {
    private nftStorage;
    constructor();
    uploadFile(file: Express.Multer.File): Promise<string>;
    uploadMultipleFiles(files: Express.Multer.File[]): Promise<string[]>;
    deleteFile(cid: string): Promise<boolean>;
}
