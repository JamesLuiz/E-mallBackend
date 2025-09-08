import { Injectable, BadRequestException } from '@nestjs/common';
import { MinioService, MinioUploadResult } from '../minio/minio.service';

@Injectable()
export class FileUploadService {
  constructor(private readonly minioService: MinioService) {}

  async uploadFile(
    file: Express.Multer.File,
  ): Promise<MinioUploadResult> {
    try {
      if (!file) {
        throw new BadRequestException('No file provided');
      }

      return await this.minioService.uploadFile(file);
    } catch (error) {
      console.error('File upload error:', error);
      throw new BadRequestException(`File upload failed: ${error.message}`);
    }
  }

  async uploadMultipleFiles(
    files: Express.Multer.File[],
  ): Promise<MinioUploadResult[]> {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files provided');
    }

    return await Promise.all(files.map((file) => this.minioService.uploadFile(file)));
  }

  async deleteFile(hash: string): Promise<boolean> {
    try {
      return true;
    } catch (error) {
      console.error('File deletion error:', error);
      return false;
    }
  }

  async getFileInfo(hash: string) {
    try {
      return null;
    } catch (error) {
      console.error('Get file info error:', error);
      return null;
    }
  }

  // Specialized upload methods for different file types
  async uploadProfilePicture(file: Express.Multer.File, userId: string): Promise<MinioUploadResult> {
    return this.minioService.uploadFile(file, 'users');
  }

  async uploadProductImages(files: Express.Multer.File[], productId: string, vendorId: string): Promise<MinioUploadResult[]> {
    return Promise.all(files.map((f) => this.minioService.uploadFile(f, 'products')));
  }

  async uploadKycDocuments(files: Express.Multer.File[], userId: string, documentType: string): Promise<MinioUploadResult[]> {
    return Promise.all(files.map((f) => this.minioService.uploadFile(f, 'kyc')));
  }

  async uploadVendorLogo(file: Express.Multer.File, vendorId: string): Promise<MinioUploadResult> {
    return this.minioService.uploadFile(file, 'vendors');
  }

  async uploadVendorBanner(file: Express.Multer.File, vendorId: string): Promise<MinioUploadResult> {
    return this.minioService.uploadFile(file, 'vendors');
  }
}