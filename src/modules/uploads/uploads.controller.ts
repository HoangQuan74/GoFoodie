import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
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
import * as sharp from 'sharp';
import { AppGuard } from 'src/app.gaurd';
import { Public } from 'src/common/decorators';
import { FileQueryDto } from './dto/file-query.dto';

@Controller('uploads')
@ApiTags('Uploads')
@UseGuards(AppGuard)
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: { file: { type: 'string', format: 'binary' }, isPublic: { type: 'boolean' } },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file: Express.Multer.File, @Body('isPublic') isPublic: boolean) {
    return this.uploadsService.upload(file, isPublic);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.uploadsService.delete(id);
  }

  @Get(':id')
  @Public()
  async download(@Param('id') id: string, @Res() res: Response, @Query() query: FileQueryDto) {
    const { width, quality } = query;
    const file = await this.uploadsService.findOne({ where: { id } });
    if (!file) throw new NotFoundException();

    const isImage = file.mimetype.startsWith('image');

    const uploadsPath = path.join(__dirname, `../../../uploads`);
    const fullPath = path.join(uploadsPath, file.path);

    if (!isImage) {
      return res.status(200).contentType(file.mimetype).sendFile(file.path);
    }

    const image = sharp(fullPath);
    if (width) image.resize(width);
    if (quality) image.jpeg({ quality: quality });

    res.contentType(file.mimetype);
    image.pipe(res);
  }
}
