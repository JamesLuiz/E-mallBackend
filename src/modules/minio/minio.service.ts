import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Client as MinioClient } from 'minio';

export type MinioUploadResult = { uri: string; hash: string; originalName?: string };

@Injectable()
export class MinioService {
  private client: MinioClient;
  private readonly bucket = process.env.MINIO_BUCKET || 'uploads';
  private readonly publicBaseUrl = process.env.MINIO_PUBLIC_BASE_URL || '';

  constructor() {
    this.client = new MinioClient({
      endPoint: process.env.MINIO_ENDPOINT || '127.0.0.1',
      port: process.env.MINIO_PORT ? parseInt(process.env.MINIO_PORT, 10) : 9000,
      useSSL: (process.env.MINIO_USE_SSL || 'false') === 'true',
      accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
      secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin',
    });
  }

  private async ensureBucket() {
    const exists = await this.client.bucketExists(this.bucket).catch(() => false);
    if (!exists) {
      await this.client.makeBucket(this.bucket, '').catch(() => {
        throw new InternalServerErrorException('Failed to create MinIO bucket');
      });
    }
  }

  async uploadFile(file: Express.Multer.File, prefix: string = 'general'): Promise<MinioUploadResult> {
    await this.ensureBucket();
    const objectName = `${prefix}/${Date.now()}-${file.originalname}`;
    try {
      await this.client.putObject(this.bucket, objectName, file.buffer, file.size, {
        'Content-Type': file.mimetype,
      });
      const uri = this.publicBaseUrl
        ? `${this.publicBaseUrl}/${this.bucket}/${objectName}`
        : `${(this.client as any).protocol}//${(this.client as any).host}/${this.bucket}/${objectName}`;
      return { uri, hash: objectName, originalName: file.originalname };
    } catch (error) {
      throw new InternalServerErrorException('Failed to upload file to MinIO');
    }
  }
}

