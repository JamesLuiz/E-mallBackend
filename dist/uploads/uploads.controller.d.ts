import { UploadsService } from './uploads.service';
export declare class UploadsController {
    private readonly uploadsService;
    constructor(uploadsService: UploadsService);
    uploadImage(file: Express.Multer.File, folder?: string): Promise<{
        uri: string;
        hash: string;
    }>;
    uploadMultiple(files: Express.Multer.File[], folder?: string): Promise<{
        files: {
            uri: string;
            hash: string;
        }[];
    }>;
    deleteImage(filename: string): Promise<void>;
}
