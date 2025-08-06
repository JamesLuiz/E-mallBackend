import { UploadsService } from './uploads.service';
export declare class UploadsController {
    private readonly uploadsService;
    constructor(uploadsService: UploadsService);
    uploadImage(file: Express.Multer.File, folder?: string): Promise<{
        url: string;
    }>;
    uploadMultiple(files: Express.Multer.File[], folder?: string): Promise<{
        urls: string[];
    }>;
    deleteImage(filename: string): Promise<void>;
}
