import { Module } from '@nestjs/common';
import { UploadsController } from './uploads.controller';
import { UploadsService } from './uploads.service';
import { PinataService } from './pinata.service';

@Module({
  controllers: [UploadsController],
  providers: [UploadsService, PinataService],
  exports: [PinataService],
})
export class UploadsModule {}
