import { Injectable } from '@nestjs/common';
import { MinioService } from '../modules/minio/minio.service';

@Injectable()
export class UploadsService {
  constructor(private readonly minioService: MinioService) {}

  async uploadImage(file: Express.Multer.File, folder: string = 'general'): Promise<{ uri: string; hash: string }> {
    return this.minioService.uploadFile(file, folder);
  }

  async uploadMultipleImages(files: Express.Multer.File[], folder: string = 'general'): Promise<{ uri: string; hash: string }[]> {
    return Promise.all(files.map(file => this.uploadImage(file, folder)));
  }

  async deleteImage(publicId: string): Promise<void> {
    // Implement deletion with MinIO if needed
  }
}
