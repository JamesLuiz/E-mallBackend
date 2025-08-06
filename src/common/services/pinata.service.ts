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
    const gateway = this.configService.get<string>('PINATA_GATEWAY');
    
    if (!jwt) {
      throw new Error('PINATA_JWT environment variable is required');
    }
    
    this.pinata = new PinataSDK({
      pinataJwt: jwt,
      pinataGateway: gateway,
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

      // Upload to Pinata using private network by default for security
      const upload = await this.pinata.upload.private.file(fileObj)
        .name(file.originalname)
        .keyvalues({
          fileType,
          uploadedAt: new Date().toISOString(),
          originalSize: file.size.toString(),
          mimeType: file.mimetype,
          ...metadata,
        });

      // Create signed access link for private files
      const signedUrl = await this.pinata.gateways.private.createAccessLink({
        cid: upload.cid,
        expires: 31536000, // 1 year in seconds
      });

      return {
        uri: signedUrl,
        hash: upload.cid,
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

  async deleteFile(cid: string): Promise<boolean> {
    try {
      // Get file ID first, then delete
      const files = await this.pinata.files.private.list()
        .cid(cid);
      
      if (files.files && files.files.length > 0) {
        const fileId = files.files[0].id;
        await this.pinata.files.private.delete([fileId]);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Pinata delete error:', error);
      return false;
    }
  }

  async getFileInfo(cid: string) {
    try {
      const files = await this.pinata.files.private.list()
        .cid(cid);
        
      return files.files && files.files.length > 0 ? files.files[0] : null;
    } catch (error) {
      console.error('Pinata get file info error:', error);
      return null;
    }
  }
}