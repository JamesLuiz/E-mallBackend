export type MinioUploadResult = {
    uri: string;
    hash: string;
    originalName?: string;
};
export declare class MinioService {
    private client;
    private readonly bucket;
    private readonly publicBaseUrl;
    constructor();
    private ensureBucket;
    uploadFile(file: Express.Multer.File, prefix?: string): Promise<MinioUploadResult>;
}
