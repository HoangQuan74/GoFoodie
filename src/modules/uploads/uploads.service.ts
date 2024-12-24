import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FileEntity } from 'src/database/entities/file.entity';
import { saveFile } from 'src/utils/file';
import { FindOneOptions, Repository } from 'typeorm';

@Injectable()
export class UploadsService {
  constructor(
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
  ) {}

  async upload(file: Express.Multer.File, isPublic = false): Promise<FileEntity> {
    file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8');
    const path = await saveFile(file);

    const newFile = new FileEntity();
    newFile.name = file.originalname;
    newFile.size = file.size;
    newFile.mimetype = file.mimetype;
    newFile.path = path;
    newFile.isPublic = isPublic;

    return this.fileRepository.save(newFile);
  }

  async delete(id: string): Promise<void> {
    await this.fileRepository.delete(id);
  }

  async findOne(options: FindOneOptions<FileEntity>): Promise<FileEntity> {
    return this.fileRepository.findOne(options);
  }
}
