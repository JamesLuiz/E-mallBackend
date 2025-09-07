export declare class PinataService {
    private readonly pinataApiKey;
    private readonly pinataSecretApiKey;
    private readonly pinataBaseUrl;
    uploadFile(file: Express.Multer.File): Promise<{
        uri: string;
        hash: string;
    }>;
}
