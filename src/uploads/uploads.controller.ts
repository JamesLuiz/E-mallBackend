import { Controller, Post, UploadedFile, UploadedFiles, UseInterceptors, Body, Delete, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { UploadsService } from './uploads.service';

@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post('image')
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(@UploadedFile() file: Express.Multer.File, @Body('folder') folder?: string) {
    const result = await this.uploadsService.uploadImage(file, folder);
    return { uri: result.uri, hash: result.hash };
  }

  @Post('multiple')
  @UseInterceptors(FilesInterceptor('images'))
  async uploadMultiple(@UploadedFiles() files: Express.Multer.File[], @Body('folder') folder?: string) {
    const results = await this.uploadsService.uploadMultipleImages(files, folder);
    return { files: results };
  }

  @Delete(':filename')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteImage(@Param('filename') filename: string) {
    await this.uploadsService.deleteImage(filename);
  }
}
