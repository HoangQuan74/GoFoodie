import {
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UploadsService } from './uploads.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import * as path from 'path';
import { AppGuard } from 'src/app.gaurd';
import { Public } from 'src/common/decorators';

@Controller('uploads')
@ApiTags('Uploads')
@UseGuards(AppGuard)
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: { type: 'object', properties: { file: { type: 'string', format: 'binary' } } },
  })
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file: Express.Multer.File) {
    return this.uploadsService.upload(file);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.uploadsService.delete(id);
  }

  @Get(':id')
  async download(@Param('id') id: string, @Res() res: Response) {
    const file = await this.uploadsService.findOne({ where: { id } });
    if (!file) throw new NotFoundException();

    const filePath = path.join(__dirname, `../../../uploads`);
    const fullPath = path.join(filePath, file.path);

    res.download(fullPath, file.name);
  }
}
