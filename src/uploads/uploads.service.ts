import { Injectable } from '@nestjs/common';
import { PinataService } from './pinata.service';

@Injectable()
export class UploadsService {
  constructor(private readonly pinataService: PinataService) {}

  async uploadImage(file: Express.Multer.File, folder: string = 'general'): Promise<{ uri: string; hash: string }> {
    // Upload to Pinata
    return this.pinataService.uploadFile(file);
  }

  async uploadMultipleImages(files: Express.Multer.File[], folder: string = 'general'): Promise<{ uri: string; hash: string }[]> {
    return Promise.all(files.map(file => this.uploadImage(file, folder)));
  }

  async deleteImage(publicId: string): Promise<void> {
    // Pinata does not support deleting files via public gateway, so this is a no-op or you can implement unpinning if needed
  }
}
