import { PinataService } from './pinata.service';
export declare class UploadsService {
    private readonly pinataService;
    constructor(pinataService: PinataService);
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
