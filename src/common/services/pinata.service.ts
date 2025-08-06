import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PinataSDK } from 'pinata';

export interface FileUploadResult {
  uri: string;
  hash: string;
  size: number;
  originalName: string;
}

export enum FileType {
  PROFILE_PICTURE = 'profile-pictures',
  PRODUCT_IMAGE = 'product-images',
  KYC_DOCUMENT = 'kyc-documents',
  VENDOR_LOGO = 'vendor-logos',
  VENDOR_BANNER = 'vendor-banners',
  GENERAL = 'general',
}

@Injectable()
export class PinataService {
  private pinata: PinataSDK;

  constructor(private configService: ConfigService) {
    const jwt = this.configService.get<string>('PINATA_JWT');
    if (!jwt) {
      throw new Error('PINATA_JWT environment variable is required');
    }
    this.pinata = new PinataSDK({
      pinataJwt: jwt,
    });
  }

  async uploadFile(
    file: Express.Multer.File,
    fileType: FileType = FileType.GENERAL,
    metadata?: Record<string, any>,
  ): Promise<FileUploadResult> {
    try {
      if (!file) {
        throw new BadRequestException('No file provided');
      }

      // File validation based on type
      this.validateFile(file, fileType);

      // Create File object from buffer
      const fileObj = new File([file.buffer], file.originalname, {
        type: file.mimetype,
      });

      // Upload to Pinata with metadata
      const upload = await this.pinata.upload.file(fileObj, {
        metadata: {
          name: file.originalname,
          keyValues: {
            fileType,
            uploadedAt: new Date().toISOString(),
            originalSize: file.size.toString(),
            mimeType: file.mimetype,
            ...metadata,
          },
        },
        groupId: this.getGroupId(fileType),
      });

      return {
        uri: `https://gateway.pinata.cloud/ipfs/${upload.IpfsHash}`,
        hash: upload.IpfsHash,
        size: file.size,
        originalName: file.originalname,
      };
    } catch (error) {
      console.error('Pinata upload error:', error);
      throw new BadRequestException(`File upload failed: ${error.message}`);
    }
  }

  async uploadMultipleFiles(
    files: Express.Multer.File[],
    fileType: FileType = FileType.GENERAL,
    metadata?: Record<string, any>,
  ): Promise<FileUploadResult[]> {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files provided');
    }

    const uploadPromises = files.map(file => 
      this.uploadFile(file, fileType, metadata)
    );
    
    return Promise.all(uploadPromises);
  }

  private validateFile(file: Express.Multer.File, fileType: FileType): void {
    const validationRules = this.getValidationRules(fileType);
    
    // Check file type
    if (!validationRules.allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        `Invalid file type. Allowed types: ${validationRules.allowedTypes.join(', ')}`
      );
    }

    // Check file size
    if (file.size > validationRules.maxSize) {
      throw new BadRequestException(
        `File size too large. Maximum ${validationRules.maxSize / (1024 * 1024)}MB allowed.`
      );
    }
  }

  private getValidationRules(fileType: FileType) {
    const rules = {
      [FileType.PROFILE_PICTURE]: {
        allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
        maxSize: 5 * 1024 * 1024, // 5MB
      },
      [FileType.PRODUCT_IMAGE]: {
        allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
        maxSize: 10 * 1024 * 1024, // 10MB
      },
      [FileType.KYC_DOCUMENT]: {
        allowedTypes: [
          'image/jpeg', 'image/jpg', 'image/png', 'image/webp',
          'application/pdf', 'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ],
        maxSize: 15 * 1024 * 1024, // 15MB
      },
      [FileType.VENDOR_LOGO]: {
        allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/svg+xml'],
        maxSize: 2 * 1024 * 1024, // 2MB
      },
      [FileType.VENDOR_BANNER]: {
        allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
        maxSize: 8 * 1024 * 1024, // 8MB
      },
      [FileType.GENERAL]: {
        allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
        maxSize: 5 * 1024 * 1024, // 5MB
      },
    };

    return rules[fileType] || rules[FileType.GENERAL];
  }

  private getGroupId(fileType: FileType): string {
    // Group files by type for better organization in Pinata
    const groupMap = {
      [FileType.PROFILE_PICTURE]: 'profile-pics',
      [FileType.PRODUCT_IMAGE]: 'product-images',
      [FileType.KYC_DOCUMENT]: 'kyc-docs',
      [FileType.VENDOR_LOGO]: 'vendor-assets',
      [FileType.VENDOR_BANNER]: 'vendor-assets',
      [FileType.GENERAL]: 'general-files',
    };

    return groupMap[fileType] || groupMap[FileType.GENERAL];
  }

  async deleteFile(hash: string): Promise<boolean> {
    try {
      await this.pinata.unpin([hash]);
      return true;
    } catch (error) {
      console.error('Pinata delete error:', error);
      return false;
    }
  }

  async getFileInfo(hash: string) {
    try {
      const files = await this.pinata.listFiles().metadata({
        name: hash,
      });
      return files.files[0] || null;
    } catch (error) {
      console.error('Pinata get file info error:', error);
      return null;
    }
  }
}