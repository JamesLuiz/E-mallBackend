import { Injectable, BadRequestException } from '@nestjs/common';
import { NFTStorage } from 'nft.storage';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FileUploadService {
  private nftStorage: NFTStorage;

  constructor() {
    const apiKey = process.env.NFTUP_API_KEY;
    if (!apiKey) {
      throw new Error('NFTUP_API_KEY environment variable is required');
    }
    this.nftStorage = new NFTStorage({ token: apiKey });
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    try {
      if (!file) {
        throw new BadRequestException('No file provided');
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.mimetype)) {
        throw new BadRequestException('Invalid file type. Only images are allowed.');
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        throw new BadRequestException('File size too large. Maximum 5MB allowed.');
      }

      // Create a File object from the buffer
      const fileObj = new File([file.buffer], `${uuidv4()}-${file.originalname}`, {
        type: file.mimetype,
      });

      // Upload to IPFS via NFT.Storage
      const cid = await this.nftStorage.storeBlob(fileObj);
      
      // Return the IPFS gateway URL
      return `https://nftstorage.link/ipfs/${cid}`;
    } catch (error) {
      console.error('File upload error:', error);
      throw new BadRequestException(`File upload failed: ${error.message}`);
    }
  }

  async uploadMultipleFiles(files: Express.Multer.File[]): Promise<string[]> {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files provided');
    }

    const uploadPromises = files.map(file => this.uploadFile(file));
    return Promise.all(uploadPromises);
  }

  async deleteFile(cid: string): Promise<boolean> {
    try {
      // Note: NFT.Storage doesn't provide direct delete functionality
      // Files are permanently stored on IPFS
      // This method is for future implementation if delete functionality becomes available
      console.log(`File deletion requested for CID: ${cid}`);
      return true;
    } catch (error) {
      console.error('File deletion error:', error);
      return false;
    }
  }
}