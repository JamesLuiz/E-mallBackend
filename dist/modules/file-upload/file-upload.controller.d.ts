import { FileUploadService } from './file-upload.service';
export declare class FileUploadController {
    private readonly fileUploadService;
    constructor(fileUploadService: FileUploadService);
    uploadSingle(file: Express.Multer.File): Promise<{
        message: string;
        url: string;
        filename: string;
        size: number;
    }>;
    uploadMultiple(files: Express.Multer.File[]): Promise<{
        message: string;
        files: {
            originalName: string;
            url: string;
            size: number;
        }[];
    }>;
}
