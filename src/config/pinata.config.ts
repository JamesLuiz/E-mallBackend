import { registerAs } from '@nestjs/config';

export default registerAs('pinata', () => ({
  apiKey: process.env.PINATA_API_KEY,
  secretApiKey: process.env.PINATA_SECRET_API_KEY,
}));