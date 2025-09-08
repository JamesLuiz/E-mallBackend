import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  BadRequestException,
  Body,
  Param,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiConsumes, ApiBearerAuth, ApiParam, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FileUploadService } from './file-upload.service';
// Pinata FileType removed; controller remains generic for MinIO
import { GetUser } from '../auth/decorators/get-user.decorator';

@ApiTags('File Upload')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('upload')
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  @Post('single')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload a single file to IPFS' })
  @ApiConsumes('multipart/form-data')
  async uploadSingle(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    
    const result = await this.fileUploadService.uploadFile(file);
    return {
      message: 'File uploaded successfully',
      ...result,
    };
  }

  @Post('multiple')
  @UseInterceptors(FilesInterceptor('files', 10))
  @ApiOperation({ summary: 'Upload multiple files to IPFS' })
  @ApiConsumes('multipart/form-data')
  async uploadMultiple(@UploadedFiles() files: Express.Multer.File[]) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files uploaded');
    }

    const results = await this.fileUploadService.uploadMultipleFiles(files);
    return {
      message: 'Files uploaded successfully',
      files: results,
    };
  }

  @Post('profile-picture')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload profile picture' })
  @ApiConsumes('multipart/form-data')
  async uploadProfilePicture(
    @UploadedFile() file: Express.Multer.File,
    @GetUser('userId') userId: string,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const result = await this.fileUploadService.uploadProfilePicture(file, userId);
    return {
      message: 'Profile picture uploaded successfully',
      ...result,
    };
  }

  @Post('kyc-documents')
  @UseInterceptors(FilesInterceptor('files', 5))
  @ApiOperation({ summary: 'Upload KYC documents' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
        documentType: {
          type: 'string',
          description: 'Type of KYC documents being uploaded',
        },
      },
    },
  })
  async uploadKycDocuments(
    @UploadedFiles() files: Express.Multer.File[],
    @Body('documentType') documentType: string,
    @GetUser('userId') userId: string,
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files uploaded');
    }

    const results = await this.fileUploadService.uploadKycDocuments(files, userId, documentType);
    return {
      message: 'KYC documents uploaded successfully',
      documents: results,
    };
  }

  @Post('product-images/:productId')
  @UseInterceptors(FilesInterceptor('files', 10))
  @ApiOperation({ summary: 'Upload product images' })
  @ApiConsumes('multipart/form-data')
  @ApiParam({ name: 'productId', description: 'Product ID' })
  async uploadProductImages(
    @UploadedFiles() files: Express.Multer.File[],
    @Param('productId') productId: string,
    @GetUser('userId') userId: string,
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files uploaded');
    }

    const results = await this.fileUploadService.uploadProductImages(files, productId, userId);
    return {
      message: 'Product images uploaded successfully',
      images: results,
    };
  }

  @Post('vendor/logo')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload vendor logo' })
  @ApiConsumes('multipart/form-data')
  async uploadVendorLogo(
    @UploadedFile() file: Express.Multer.File,
    @GetUser('userId') userId: string,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const result = await this.fileUploadService.uploadVendorLogo(file, userId);
    return {
      message: 'Vendor logo uploaded successfully',
      ...result,
    };
  }

  @Post('vendor/banner')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload vendor banner' })
  @ApiConsumes('multipart/form-data')
  async uploadVendorBanner(
    @UploadedFile() file: Express.Multer.File,
    @GetUser('userId') userId: string,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const result = await this.fileUploadService.uploadVendorBanner(file, userId);
    return {
      message: 'Vendor banner uploaded successfully',
      ...result,
    };
  }
}