import { Injectable, InternalServerErrorException } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class PinataService {
  private readonly pinataApiKey = process.env.PINATA_API_KEY;
  private readonly pinataSecretApiKey = process.env.PINATA_SECRET_API_KEY;
  private readonly pinataBaseUrl = 'https://api.pinata.cloud/pinning/pinFileToIPFS';

  async uploadFile(file: Express.Multer.File): Promise<{ uri: string; hash: string }> {
    const formData = new FormData();
    formData.append('file', file.buffer, file.originalname);

    try {
      const response = await axios.post(this.pinataBaseUrl, formData, {
        maxBodyLength: Infinity,
        headers: {
          ...formData.getHeaders(),
          pinata_api_key: this.pinataApiKey,
          pinata_secret_api_key: this.pinataSecretApiKey,
        },
      });
      const { IpfsHash } = response.data;
      return {
        uri: `https://gateway.pinata.cloud/ipfs/${IpfsHash}`,
        hash: IpfsHash,
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to upload file to Pinata');
    }
  }
}