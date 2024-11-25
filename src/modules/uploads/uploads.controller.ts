import { Controller, Delete, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { UploadsService } from './uploads.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';

@Controller('uploads')
@ApiTags('Uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: { type: 'object', properties: { file: { type: 'string', format: 'binary' } } },
  })
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file: Express.Multer.File) {
    return this.uploadsService.upload(file, 'uploads');
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.uploadsService.delete(id);
  }
}
