import { Injectable, BadRequestException } from '@nestjs/common';
import { PinataService, FileType, FileUploadResult } from '../../common/services/pinata.service';

@Injectable()
export class FileUploadService {
  constructor(private readonly pinataService: PinataService) {}

  async uploadFile(
    file: Express.Multer.File,
    fileType: FileType = FileType.GENERAL,
    metadata?: Record<string, any>
  ): Promise<FileUploadResult> {
    try {
      if (!file) {
        throw new BadRequestException('No file provided');
      }

      return await this.pinataService.uploadFile(file, fileType, metadata);
    } catch (error) {
      console.error('File upload error:', error);
      throw new BadRequestException(`File upload failed: ${error.message}`);
    }
  }

  async uploadMultipleFiles(
    files: Express.Multer.File[],
    fileType: FileType = FileType.GENERAL,
    metadata?: Record<string, any>
  ): Promise<FileUploadResult[]> {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files provided');
    }

    return await this.pinataService.uploadMultipleFiles(files, fileType, metadata);
  }

  async deleteFile(hash: string): Promise<boolean> {
    try {
      return await this.pinataService.deleteFile(hash);
    } catch (error) {
      console.error('File deletion error:', error);
      return false;
    }
  }

  async getFileInfo(hash: string) {
    try {
      return await this.pinataService.getFileInfo(hash);
    } catch (error) {
      console.error('Get file info error:', error);
      return null;
    }
  }

  // Specialized upload methods for different file types
  async uploadProfilePicture(file: Express.Multer.File, userId: string): Promise<FileUploadResult> {
    return this.uploadFile(file, FileType.PROFILE_PICTURE, { userId });
  }

  async uploadProductImages(files: Express.Multer.File[], productId: string, vendorId: string): Promise<FileUploadResult[]> {
    return this.uploadMultipleFiles(files, FileType.PRODUCT_IMAGE, { productId, vendorId });
  }

  async uploadKycDocuments(files: Express.Multer.File[], userId: string, documentType: string): Promise<FileUploadResult[]> {
    return this.uploadMultipleFiles(files, FileType.KYC_DOCUMENT, { userId, documentType });
  }

  async uploadVendorLogo(file: Express.Multer.File, vendorId: string): Promise<FileUploadResult> {
    return this.uploadFile(file, FileType.VENDOR_LOGO, { vendorId });
  }

  async uploadVendorBanner(file: Express.Multer.File, vendorId: string): Promise<FileUploadResult> {
    return this.uploadFile(file, FileType.VENDOR_BANNER, { vendorId });
  }
}