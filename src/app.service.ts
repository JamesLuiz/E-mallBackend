import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getStatus() {
    return {
      message: 'Abuja E-Mall API is running!',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
    };
  }
}