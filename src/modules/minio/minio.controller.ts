import { Controller, Post, UseInterceptors, UploadedFile, BadRequestException, Query } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { MinioService } from './minio.service';

@ApiTags('MinIO')
@ApiBearerAuth()
@Controller('minio')
export class MinioController {
  constructor(private readonly minioService: MinioService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload a file to MinIO' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
        prefix: { type: 'string' },
      },
    },
  })
  async upload(@UploadedFile() file: Express.Multer.File, @Query('prefix') prefix?: string) {
    if (!file) throw new BadRequestException('No file provided');
    return this.minioService.uploadFile(file, prefix || 'general');
  }
}

