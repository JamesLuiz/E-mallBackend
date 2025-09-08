import { Module } from '@nestjs/common';
import { UploadsController } from './uploads.controller';
import { UploadsService } from './uploads.service';
import { MinioModule } from '../modules/minio/minio.module';

@Module({
  imports: [MinioModule],
  controllers: [UploadsController],
  providers: [UploadsService],
  exports: [],
})
export class UploadsModule {}
